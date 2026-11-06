#!/usr/bin/env node
import { randomInt } from 'node:crypto';
import { ZodError } from 'zod';
import winston from 'winston';
import { parseArgs, USAGE } from './args.utils';
import { loadEnv } from './env';
import { createLogger } from './logger';
import { createQuoteApi } from './quote.api';
import { Env, maxSchema } from './pick-quote.schema';
import { CliArgs, Outcome } from './pick-quote.types';
import { pickQuote } from './pick-quote.usecase';
import { redact, secretsOf } from './pick-quote.utils';

const DEFAULT_MAX = 100;
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
  const env: Env = loadEnv();
  const url: string | undefined = args.url ?? env.DEFAULT_SEARCH_URL;
  if (url === undefined) {
    return fail('MISSING_PARAM', `--url is required when DEFAULT_SEARCH_URL is not set. ${USAGE}`);
  }
  const max: number = maxSchema.parse(args.max ?? DEFAULT_MAX);
  const logger: winston.Logger = createLogger(env.LOG_LEVEL);
  const execute: (input: { url: string; max: number }) => Promise<Outcome> = pickQuote({
    api: createQuoteApi({ baseUrl: env.API_URL, apiKey: env.API_KEY, timeoutMs: TIMEOUT_MS, logger }),
    logger,
    random: (n: number): number => randomInt(n),
  });
  return execute({ url, max });
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
  return fail('BAD_INPUT', redact(secrets())(error instanceof Error ? error.message : String(error)));
};

run(process.argv.slice(2))
  .catch(describe)
  .then((outcome: Outcome): void => {
    if (!('error' in outcome.output && outcome.output.error.code === 'HELP')) {
      print(outcome.output);
    }
    process.exitCode = outcome.exitCode;
  });
