import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { EXIT_CODE, toolError } from './errors';
import { SyncOptions } from './sync.types';
import { relativeToResults } from './sync.utils';

export const USAGE: string = 'usage: sync-results-s3 [--dir <path inside RESULTS_DIR>] [--dry-run]';

// --dir is resolved against the cwd; it must exist and sit inside RESULTS_DIR (default RESULTS_DIR itself).
export const parseOptions =
  (resultsDir: string) =>
  async (argv: string[]): Promise<SyncOptions> => {
    const parsed: { values: { dir?: string; 'dry-run'?: boolean } } = (() => {
      try {
        return parseArgs({ args: argv, options: { dir: { type: 'string' }, 'dry-run': { type: 'boolean' } }, strict: true });
      } catch (error: unknown) {
        throw toolError('USAGE', `${error instanceof Error ? error.message : String(error)}; ${USAGE}`, EXIT_CODE.error);
      }
    })();
    const root: string = resolve(resultsDir);
    const dir: string = parsed.values.dir === undefined ? root : resolve(parsed.values.dir);
    try {
      relativeToResults(root)(dir);
    } catch (error: unknown) {
      throw toolError('BAD_INPUT', error instanceof Error ? error.message : String(error), EXIT_CODE.error);
    }
    await stat(dir).catch((): never => {
      throw toolError('BAD_INPUT', `--dir ${dir} does not exist`, EXIT_CODE.error);
    });
    return { dir, dryRun: parsed.values['dry-run'] === true };
  };
