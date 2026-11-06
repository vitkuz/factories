#!/usr/bin/env node
import path from 'node:path';
import { ZodError } from 'zod';
import winston from 'winston';
import { parseArgs, USAGE } from './args.utils';
import { loadEnv } from './env';
import { createLogger } from './logger';
import { createQuoteApi } from './quote.api';
import { Env, skillIdSchema, uuidSchema } from './record-processing.schema';
import { CliArgs, Outcome } from './record-processing.types';
import { recordProcessing } from './record-processing.usecase';
import { redact, secretsOf } from './record-processing.utils';

const DEFAULT_SKILL = 'quote-to-question-v1-factory';
const TIMEOUT_MS = 30000;

const print = (value: unknown): void => {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
};

const fail = (code: string, message: string): Outcome => ({ exitCode: 1, output: { error: { code, message } } });

const run = async (argv: string[]): Promise<Outcome> => {
  const parsed: CliArgs | Error = ((): CliArgs | Error => {
    try {
      return parseArgs(argv);
    } catch (error: unknown) {
      return error instanceof Error ? error : new Error(String(error));
    }
  })();
  if (parsed instanceof Error) {
    return fail('BAD_INPUT', `${parsed.message}. ${USAGE}`);
  }
  const args: CliArgs = parsed;
  if (args.help) {
    process.stderr.write(`${USAGE}\n`);
    return { exitCode: 0, output: { error: { code: 'HELP', message: USAGE } } };
  }
  if (args.uuid === '' || args.runDir === '') {
    return fail('MISSING_PARAM', `--uuid and --run-dir are required. ${USAGE}`);
  }
  const env: Env = loadEnv();
  const logger: winston.Logger = createLogger(env.LOG_LEVEL);
  const uuid: string = uuidSchema.parse(args.uuid.toLowerCase());
  const skill: string = skillIdSchema.parse(args.skill ?? env.SKILL_ID ?? DEFAULT_SKILL);
  const execute: (input: Parameters<ReturnType<typeof recordProcessing>>[0]) => Promise<Outcome> = recordProcessing({
    api: createQuoteApi({ baseUrl: env.API_URL, apiKey: env.API_KEY, timeoutMs: TIMEOUT_MS, logger }),
    logger,
    resultsDir: path.resolve(env.RESULTS_DIR),
    s3Prefix: env.S3_PREFIX,
  });
  return execute({ uuid, runDir: args.runDir, skill, skipLog: args.skipLog, skipMeta: args.skipMeta, dryRun: args.dryRun });
};

const secrets = (): string[] => secretsOf(process.env.API_KEY ?? '', process.env.API_URL ?? '');

const describe = (error: unknown): Outcome => {
  if (error instanceof ZodError) {
    return fail(
      'BAD_INPUT',
      error.issues
        .map(
          (issue: { path: PropertyKey[]; message: string }): string => `${issue.path.map(String).join('.') || 'input'}: ${issue.message}`,
        )
        .join('; '),
    );
  }
  return fail('INTERNAL', redact(secrets())(error instanceof Error ? error.message : String(error)));
};

run(process.argv.slice(2))
  .catch(describe)
  .then((outcome: Outcome): void => {
    if (!('error' in outcome.output && outcome.output.error.code === 'HELP')) {
      print(outcome.output);
    }
    process.exitCode = outcome.exitCode;
  });
