import path from 'node:path';
import { stepMapSchema } from './record-processing.schema';
import {
  ApiFailure,
  ApiFailureClass,
  EntryPatch,
  Processing,
  ProcessingPatch,
  QuoteMeta,
  SemanticCore,
  StepMap,
  UpdateBody,
} from './record-processing.types';

// Files directly in the run folder (not inside a step folder) go under this key.
export const RUN_LEVEL_KEY = '_run';
export const IGNORED_NAMES: string[] = ['.git', '.DS_Store', 'node_modules'];

export const quotePk = (uuid: string): string => `quote#${uuid}`;

export const normalizePrefix = (prefix: string): string => (prefix === '' || prefix.endsWith('/') ? prefix : `${prefix}/`);

const toPosix = (relative: string): string => relative.split(path.sep).join('/');

export const isInside = (root: string, target: string): boolean => {
  const relative: string = path.relative(path.resolve(root), path.resolve(target));
  // `..` or `../…` is outside; a name that merely starts with `..` (e.g. `..notes.json`) is inside.
  return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
};

// The S3 key rule (shared with sync-results-s3): prefix + the path relative to RESULTS_DIR, "/" separators.
export const s3Key =
  (resultsDir: string) =>
  (prefix: string) =>
  (filePath: string): string => {
    if (!isInside(resultsDir, filePath)) {
      throw new Error(`path is outside RESULTS_DIR: ${filePath}`);
    }
    return `${normalizePrefix(prefix)}${toPosix(path.relative(path.resolve(resultsDir), path.resolve(filePath)))}`;
  };

// The step folder of a file = the first segment of its path relative to the run folder; a file directly in the run
// folder belongs to `_run`.
export const stepOf =
  (runDir: string) =>
  (filePath: string): string => {
    const segments: string[] = toPosix(path.relative(path.resolve(runDir), path.resolve(filePath))).split('/');
    return segments.length > 1 ? segments[0] : RUN_LEVEL_KEY;
  };

const sortKeys = (map: StepMap): StepMap =>
  Object.fromEntries(
    Object.keys(map)
      .sort()
      .map((step: string): [string, string[]] => [step, [...map[step]].sort()]),
  );

// { "<step folder>": ["<s3 key>", ...] }: every file of each step folder, keys and lists sorted.
export const buildStepMap =
  (settings: { resultsDir: string; prefix: string; runDir: string }) =>
  (files: string[]): StepMap => {
    const keyOf: (filePath: string) => string = s3Key(settings.resultsDir)(settings.prefix);
    const step: (filePath: string) => string = stepOf(settings.runDir);
    const grouped: StepMap = files.reduce(
      (acc: StepMap, file: string): StepMap => ({ ...acc, [step(file)]: [...(acc[step(file)] ?? []), keyOf(file)] }),
      {},
    );
    return sortKeys(grouped);
  };

// What the quote's `processing` should be after the write: other skills' entries kept, this skill's entry replaced.
export const mergeProcessing =
  (existing: Processing | undefined) =>
  (skill: string) =>
  (entry: StepMap): Processing => ({ ...(existing ?? {}), [skill]: entry });

// The patch the API deep-merges (05-route-patterns): only this skill's entry, plus `null` for each step key stored
// before but absent from this run (so a rerun with fewer steps leaves no stale keys). Arrays replace on the server.
// Other skills' entries are never sent, so a concurrent write by another factory is never undone.
export const entryPatch =
  (stored: Processing | undefined) =>
  (skill: string) =>
  (entry: StepMap): ProcessingPatch => {
    const stale: EntryPatch = Object.fromEntries(
      Object.keys(stored?.[skill] ?? {})
        .filter((step: string): boolean => !Object.prototype.hasOwnProperty.call(entry, step))
        .map((step: string): [string, null] => [step, null]),
    );
    return { [skill]: { ...entry, ...stale } };
  };

// This skill's entry of an answered `processing`, when it has the step-map shape; `undefined` otherwise.
export const stepMapOf =
  (processing: Processing | undefined) =>
  (skill: string): StepMap | undefined => {
    const parsed: ReturnType<typeof stepMapSchema.safeParse> = stepMapSchema.safeParse(processing?.[skill]);
    return parsed.success ? parsed.data : undefined;
  };

// The API's limits for the quote's arrays (02-dynamodb, 11-open-questions #2): items per field, characters per item.
export const META_LIMITS: { category: number; tags: number; item: number } = { category: 5, tags: 10, item: 60 };
// The semantic core's catch-all domain: says nothing about the quote, never becomes a category.
export const NO_DOMAIN = 'другое';

const cleanItems = (items: string[]): string[] =>
  items.map((item: string): string => item.trim()).filter((item: string): boolean => item.length > 0 && item.length <= META_LIMITS.item);

// Stored items first (never dropped), then new ones not already there (case-insensitive), up to `max` items.
export const appendUnique =
  (max: number) =>
  (stored: string[]) =>
  (extra: string[]): string[] =>
    extra.reduce(
      (acc: string[], item: string): string[] =>
        acc.length >= max || acc.some((kept: string): boolean => kept.toLowerCase() === item.toLowerCase()) ? acc : [...acc, item],
      stored,
    );

// What the semantic core suggests: `category` = its primaryDomain (unless `другое`), `tags` = its themes, lowercase.
export const metaFromCore = (core: SemanticCore): Required<QuoteMeta> => ({
  category: cleanItems(core.primaryDomain === undefined || core.primaryDomain.trim() === NO_DOMAIN ? [] : [core.primaryDomain]),
  tags: cleanItems((core.themes ?? []).map((theme: string): string => theme.toLowerCase())),
});

// The quote's `category` and `tags` after the write: the stored values kept, the core's added after them.
export const mergeMeta =
  (stored: QuoteMeta) =>
  (core: SemanticCore): Required<QuoteMeta> => {
    const suggested: Required<QuoteMeta> = metaFromCore(core);
    return {
      category: appendUnique(META_LIMITS.category)(stored.category ?? [])(suggested.category),
      tags: appendUnique(META_LIMITS.tags)(stored.tags ?? [])(suggested.tags),
    };
  };

const sameItems = (left: string[], right: string[]): boolean =>
  left.length === right.length && left.every((item: string, index: number): boolean => item === right[index]);

// Only the fields that change: the API replaces arrays, so each sent field carries the whole merged list.
export const metaPatch =
  (stored: QuoteMeta) =>
  (next: Required<QuoteMeta>): QuoteMeta => ({
    ...(sameItems(stored.category ?? [], next.category) ? {} : { category: next.category }),
    ...(sameItems(stored.tags ?? [], next.tags) ? {} : { tags: next.tags }),
  });

export const buildUpdateBody =
  (uuid: string) =>
  (skipLog: boolean) =>
  (processing: ProcessingPatch, meta: QuoteMeta = {}): UpdateBody => ({
    pk: quotePk(uuid),
    patch: { ...meta, processing },
    ...(skipLog ? { skipLog: true as const } : {}),
  });

const UNKNOWN_KEY_PATTERN: RegExp = /unrecogni[sz]ed key|unknown key|not allowed/i;

// 404 = the quote does not exist; a 400 naming an unknown key = the strict update schema does not know `processing`
// yet (pending API change); anything else is a plain failure.
export const classifyApiFailure = (failure: ApiFailure): ApiFailureClass => {
  if (failure.status === 404) {
    return 'not-found';
  }
  if (failure.status === 400 && UNKNOWN_KEY_PATTERN.test(failure.message)) {
    return 'api-pending';
  }
  return 'other';
};

export const isApiFailure = (value: unknown): value is ApiFailure =>
  typeof value === 'object' && value !== null && (value as ApiFailure).kind === 'api-failure';

// The strings to hide for an API key and URL: the key, the URL (with and without a trailing slash) and its host (a
// network error such as `getaddrinfo ENOTFOUND <host>` names only the host).
export const secretsOf = (apiKey: string, apiUrl: string): string[] => {
  const host: string = ((): string => {
    try {
      return new URL(apiUrl).host;
    } catch {
      return '';
    }
  })();
  return [...new Set([apiKey, apiUrl, apiUrl.replace(/\/+$/, ''), host])].filter((secret: string): boolean => secret.length > 0);
};

// Hides the API key and URL in any text before it is logged or printed.
export const redact =
  (secrets: string[]) =>
  (text: string): string =>
    secrets
      .filter((secret: string): boolean => secret.length > 0)
      .reduce((acc: string, secret: string): string => acc.split(secret).join('***'), text);
