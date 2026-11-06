import { isAbsolute } from 'node:path';
import { z } from 'zod';

// The env of the tool, read from the package's own .env (never from the cwd).
export const envSchema = z.object({
  AWS_PROFILE: z.string().min(1),
  AWS_REGION: z.string().min(1),
  S3_BUCKET: z.string().min(3),
  S3_PREFIX: z.string().default(''),
  // Absolute: a relative path would resolve against the cwd, not the package folder.
  RESULTS_DIR: z.string().min(1).refine(isAbsolute, { message: 'RESULTS_DIR must be an absolute path' }),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Env = z.infer<typeof envSchema>;
