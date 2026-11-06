import { z } from 'zod';

export const SEARCH_SCOPES: readonly ['all', 'text', 'author', 'id', 'sense'] = ['all', 'text', 'author', 'id', 'sense'] as const;
export const SEARCH_SORTS: readonly ['relevance', 'updated'] = ['relevance', 'updated'] as const;

const emptyToUndefined = (value: string | undefined): string | undefined =>
  value === undefined || value.trim() === '' ? undefined : value;

export const envSchema = z.object({
  API_URL: z.string().url(),
  API_KEY: z.string().min(1),
  // The console search URL used when --url is not given.
  DEFAULT_SEARCH_URL: z.string().optional().transform(emptyToUndefined),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

// --max: how many hits to collect before picking (quote.search pages of up to 100; sense answers at most 50).
export const maxSchema = z.coerce.number().int().min(1).max(1000);

// One hit of quote.search / quote.searchBySense: only the fields this tool reads are checked; the rest passes through.
export const quoteHitSchema = z
  .object({
    pk: z.string(),
    uuid: z.string(),
    origin: z.string(),
    lang: z.string(),
    author: z.array(z.string()).optional(),
  })
  .passthrough();

// `{ items, cursor?, total, took }` (quote.search) or `{ items, total, took }` (quote.searchBySense).
export const searchAnswerSchema = z.object({
  items: z.array(quoteHitSchema),
  cursor: z.string().optional(),
  total: z.number(),
  took: z.number().optional(),
});

// The API's error answer: `{ "error": { "code", "message" } }`.
export const apiErrorAnswerSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }).passthrough(),
});
