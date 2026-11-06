import { config } from 'dotenv';
import { resolve } from 'node:path';
import { Env, envSchema } from './env.schema';

// src/ (ts-node) and dist/ (built) both sit one level below the package folder.
export const ENV_FILE: string = resolve(__dirname, '..', '.env');

export const loadEnv = (source: NodeJS.ProcessEnv = process.env): Env => {
  config({ path: ENV_FILE, quiet: true });
  return envSchema.parse(source);
};
