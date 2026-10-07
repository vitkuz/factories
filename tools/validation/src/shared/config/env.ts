import { z } from 'zod';
import { config } from 'dotenv';

// quiet: stdout belongs to the report (`--json` is piped into other tools).
config({ quiet: true });

const envSchema = z.object({
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

// Validate process.env
const env: Env = envSchema.parse(process.env);

export default env;
