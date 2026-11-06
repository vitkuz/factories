import { z } from 'zod';

export const UUID_PATTERN: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const envSchema = z.object({
  API_URL: z.string().url(),
  API_KEY: z.string().min(1),
  RESULTS_DIR: z.string().min(1),
  S3_PREFIX: z.string().default(''),
  SKILL_ID: z
    .string()
    .optional()
    .transform((value: string | undefined): string | undefined => (value === '' ? undefined : value)),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

export const skillIdSchema = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'skill must be lowercase letters, digits and dashes');

export const uuidSchema = z.string().regex(UUID_PATTERN, 'must be a uuid');

// This skill's entry: step folder -> S3 keys. Checked on the answer for our own skill only (stepMapOf).
export const stepMapSchema = z.record(z.string(), z.array(z.string()));

// Every factory's entry is a JSON object of its own shape; only ours is checked as a step map.
export const processingSchema = z.record(z.string(), z.record(z.string(), z.unknown()));

// The API's quote answer: only `pk`, `uuid` are required here; `processing`, when present, is factory id -> object.
export const quoteAnswerSchema = z
  .object({
    pk: z.string(),
    uuid: z.string(),
    updatedAt: z.string().optional(),
    processing: processingSchema.optional(),
    category: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  })
  .passthrough();

// The extract-core step's semantic core: only the fields this tool reads; the rest passes through.
export const semanticCoreSchema = z
  .object({
    primaryDomain: z.string().optional(),
    themes: z.array(z.string()).optional(),
  })
  .passthrough();

// The API's error answer: `{ "error": { "code", "message" } }` (05-route-patterns).
export const apiErrorAnswerSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }).passthrough(),
});
