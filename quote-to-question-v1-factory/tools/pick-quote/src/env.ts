import path from 'node:path';
import dotenv from 'dotenv';
import { Env, envSchema } from './pick-quote.schema';

// The package folder: src/ (ts-node) and dist/ (built) both sit one level below it.
export const PACKAGE_DIR: string = path.resolve(__dirname, '..');

// Loads <package>/.env (never the cwd's) and validates it. `quiet`: dotenv must not write to stdout.
export const loadEnv = (): Env => {
  dotenv.config({ path: path.join(PACKAGE_DIR, '.env'), quiet: true });
  return envSchema.parse(process.env);
};
