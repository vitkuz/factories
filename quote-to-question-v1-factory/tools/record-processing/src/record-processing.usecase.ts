import { promises as fs, Stats } from 'node:fs';
import path from 'node:path';
import { listFiles, readSemanticCore, SEMANTIC_CORE_FILE } from './files';
import {
  ApiFailure,
  Outcome,
  Processing,
  Quote,
  QuoteMeta,
  RecordInput,
  RecordSettings,
  SemanticCore,
  StepMap,
  UpdateBody,
} from './record-processing.types';
import {
  buildStepMap,
  buildUpdateBody,
  classifyApiFailure,
  entryPatch,
  isApiFailure,
  isInside,
  mergeMeta,
  mergeProcessing,
  metaPatch,
  quotePk,
  stepMapOf,
} from './record-processing.utils';

export const API_PENDING_MESSAGE = 'API does not accept `processing` yet (pending API change)';

const failure = (code: string, message: string, status?: number): Outcome => ({
  exitCode: 1,
  output: { error: { code, message, ...(status === undefined ? {} : { status }) } },
});

const fromApiFailure = (apiFailure: ApiFailure, request?: UpdateBody): Outcome => ({
  exitCode: 1,
  output: {
    error: {
      code: apiFailure.code,
      message: apiFailure.message,
      ...(apiFailure.status === undefined ? {} : { status: apiFailure.status }),
    },
    ...(request === undefined ? {} : { request }),
  },
});

const notFound = (uuid: string): Outcome => ({
  exitCode: 2,
  output: { error: { code: 'NOT_FOUND', message: `quote not found: ${uuid}`, status: 404 } },
});

// The run folder must exist, be a directory and sit under RESULTS_DIR/<uuid>/ (so the keys belong to this quote).
const checkRunDir = async (resultsDir: string, input: RecordInput): Promise<string | undefined> => {
  const stats: Stats | undefined = await fs.stat(input.runDir).catch((): undefined => undefined);
  if (stats === undefined || !stats.isDirectory()) {
    return `run dir is not a directory: ${input.runDir}`;
  }
  if (!isInside(path.join(resultsDir, input.uuid), input.runDir)) {
    return `run dir must be inside RESULTS_DIR/${input.uuid}/`;
  }
  return undefined;
};

// dry-run: an unreachable API is not fatal (the patch is printed with no existing processing); 404 always is.
const readQuote =
  (settings: RecordSettings) =>
  async (input: RecordInput): Promise<{ quote?: Quote; outcome?: Outcome }> => {
    try {
      return { quote: await settings.api.getOneByUuid(input.uuid) };
    } catch (error: unknown) {
      if (!isApiFailure(error)) {
        throw error;
      }
      if (classifyApiFailure(error) === 'not-found') {
        return { outcome: notFound(input.uuid) };
      }
      if (input.dryRun) {
        settings.logger.warn('quote could not be read; the dry-run patch has no existing processing', {
          code: error.code,
          status: error.status,
        });
        return {};
      }
      return { outcome: fromApiFailure(error) };
    }
  };

// The run's semantic core: `undefined` with --skip-meta or when the run has none (logged); a broken file is BAD_INPUT.
const loadCore =
  (settings: RecordSettings) =>
  async (input: RecordInput): Promise<{ core?: SemanticCore; outcome?: Outcome }> => {
    if (input.skipMeta) {
      return {};
    }
    try {
      const core: SemanticCore | undefined = await readSemanticCore(input.runDir);
      if (core === undefined) {
        settings.logger.warn('no semantic core in the run; category and tags are left as they are', { file: SEMANTIC_CORE_FILE });
      }
      return core === undefined ? {} : { core };
    } catch (error: unknown) {
      return { outcome: failure('BAD_INPUT', `${SEMANTIC_CORE_FILE}: ${error instanceof Error ? error.message : String(error)}`) };
    }
  };

export const recordProcessing =
  (settings: RecordSettings) =>
  async (input: RecordInput): Promise<Outcome> => {
    const runDir: string = path.resolve(input.runDir);
    const resolved: RecordInput = { ...input, runDir };
    const dirProblem: string | undefined = await checkRunDir(settings.resultsDir, resolved);
    if (dirProblem !== undefined) {
      return failure('BAD_INPUT', dirProblem);
    }
    const files: string[] = await listFiles(runDir);
    if (files.length === 0) {
      return failure('BAD_INPUT', `run dir has no files: ${runDir}`);
    }
    const entry: StepMap = buildStepMap({ resultsDir: settings.resultsDir, prefix: settings.s3Prefix, runDir })(files);
    settings.logger.info('step map built', { steps: Object.keys(entry).length, files: files.length });

    const loaded: { core?: SemanticCore; outcome?: Outcome } = await loadCore(settings)(resolved);
    if (loaded.outcome !== undefined) {
      return loaded.outcome;
    }

    const read: { quote?: Quote; outcome?: Outcome } = await readQuote(settings)(resolved);
    if (read.outcome !== undefined) {
      return read.outcome;
    }
    // `category` and `tags`: the stored values kept, the semantic core's added; only changed fields are sent.
    const stored: QuoteMeta = { category: read.quote?.category, tags: read.quote?.tags };
    const meta: Required<QuoteMeta> | undefined = loaded.core === undefined ? undefined : mergeMeta(stored)(loaded.core);
    // `processing` = what the quote should hold after the write; the request carries only this skill's entry.
    const processing: Processing = mergeProcessing(read.quote?.processing)(input.skill)(entry);
    const request: UpdateBody = buildUpdateBody(input.uuid)(input.skipLog)(
      entryPatch(read.quote?.processing)(input.skill)(entry),
      meta === undefined ? {} : metaPatch(stored)(meta),
    );
    const base: {
      uuid: string;
      pk: string;
      skill: string;
      dryRun: boolean;
      processing: Processing;
      meta?: QuoteMeta;
      request: UpdateBody;
    } = {
      uuid: input.uuid,
      pk: quotePk(input.uuid),
      skill: input.skill,
      dryRun: input.dryRun,
      processing,
      ...(meta === undefined ? {} : { meta }),
      request,
    };
    if (input.dryRun) {
      return { exitCode: 0, output: { ...base, status: 'dry-run' } };
    }

    try {
      const updated: Quote = await settings.api.updateOneByPk(request);
      if (updated.processing !== undefined && stepMapOf(updated.processing)(input.skill) === undefined) {
        return failure('BAD_ANSWER', `the answered processing["${input.skill}"] is not a step map`);
      }
      return {
        exitCode: 0,
        output: {
          ...base,
          status: 'updated',
          processing: updated.processing ?? processing,
          ...(meta === undefined ? {} : { meta: { category: updated.category ?? [], tags: updated.tags ?? [] } }),
          ...(updated.updatedAt === undefined ? {} : { updatedAt: updated.updatedAt }),
        },
      };
    } catch (error: unknown) {
      if (!isApiFailure(error)) {
        throw error;
      }
      const kind: string = classifyApiFailure(error);
      if (kind === 'api-pending') {
        return { exitCode: 3, output: { ...base, status: 'api-pending', message: API_PENDING_MESSAGE, apiMessage: error.message } };
      }
      if (kind === 'not-found') {
        return notFound(input.uuid);
      }
      return fromApiFailure(error, request);
    }
  };
