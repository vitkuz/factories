#!/usr/bin/env node
import { resolve } from 'node:path';
import { parseOptions } from './args';
import { loadEnv } from './env';
import { Env } from './env.schema';
import { exitCodeOf, EXIT_CODE, toErrorBody } from './errors';
import { nodeFileSystem } from './files';
import { logger, setLogLevel } from './logger';
import { createS3Adapter } from './s3.adapter';
import { syncResultsFactory } from './sync.usecase';
import { S3Adapter, SyncOptions, SyncResult, SyncSettings } from './sync.types';

const print = (value: unknown): void => {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
};

const main = async (): Promise<number> => {
  const env: Env = loadEnv();
  setLogLevel(env.LOG_LEVEL);
  const settings: SyncSettings = { bucket: env.S3_BUCKET, prefix: env.S3_PREFIX, resultsDir: resolve(env.RESULTS_DIR) };
  const options: SyncOptions = await parseOptions(settings.resultsDir)(process.argv.slice(2));
  const s3: S3Adapter = createS3Adapter({ profile: env.AWS_PROFILE, region: env.AWS_REGION, bucket: env.S3_BUCKET, logger });
  const result: SyncResult = await syncResultsFactory({ settings, s3, fs: nodeFileSystem, logger })(options);
  print(result);
  return EXIT_CODE.ok;
};

main()
  .then((code: number): void => {
    process.exitCode = code;
  })
  .catch((error: unknown): void => {
    const body: { code: string; message: string } = toErrorBody(error);
    logger.error(body.message, { code: body.code });
    print({ error: body });
    process.exitCode = exitCodeOf(error);
  });
