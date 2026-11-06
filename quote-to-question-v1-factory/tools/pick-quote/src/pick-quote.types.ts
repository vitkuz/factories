import { z } from 'zod';
import { quoteHitSchema, SEARCH_SCOPES, SEARCH_SORTS, searchAnswerSchema } from './pick-quote.schema';

export type SearchScope = (typeof SEARCH_SCOPES)[number];
export type SearchSort = (typeof SEARCH_SORTS)[number];

export type QuoteHit = z.infer<typeof quoteHitSchema>;
export type SearchAnswer = z.infer<typeof searchAnswerSchema>;

// The body of quote.search, as the console builds it from its URL (05-route-patterns).
export interface SearchBody {
  query?: string;
  scope?: Exclude<SearchScope, 'sense'>;
  sort?: SearchSort;
  lang?: string;
  author?: string;
  category?: string;
  tag?: string;
  processed?: false;
  limit?: number;
  cursor?: string;
}

// The body of quote.searchBySense (the console's `sense` scope): one page of at most 50 k-NN hits.
export interface SenseBody {
  query: string;
  lang?: string;
  limit?: number;
}

// What a console URL asks for: quote.search or quote.searchBySense, without `limit` / `cursor` (the tool pages).
export type SearchRequest = { route: 'search'; body: SearchBody } | { route: 'searchBySense'; body: SenseBody };

export interface CliArgs {
  url?: string;
  max?: string;
  help: boolean;
}

// What the factory reads: the quote's text, uuid and author, plus where it came from.
export interface PickedQuote {
  status: 'picked';
  quote: string;
  quoteId: string;
  author: string;
  lang: string;
  pk: string;
  source: string;
  // The answer's `total`, the number of hits collected, and the index of the picked one among them.
  total: number;
  pool: number;
  index: number;
  request: SearchRequest;
  ignored: string[];
}

export interface EmptyResult {
  status: 'empty';
  source: string;
  total: number;
  request: SearchRequest;
  ignored: string[];
}

export interface ApiFailure {
  kind: 'api-failure';
  status?: number;
  code: string;
  message: string;
}

export interface ErrorOutput {
  error: { code: string; message: string; status?: number };
}

// What the CLI prints on stdout and the exit code: 0 picked, 1 error, 2 no hits.
export interface Outcome {
  exitCode: 0 | 1 | 2;
  output: PickedQuote | EmptyResult | ErrorOutput;
}

export interface Logger {
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
}

export interface QuoteApiSettings {
  baseUrl: string;
  apiKey: string;
  timeoutMs: number;
  logger: Logger;
}

export interface QuoteApi {
  search: (body: SearchBody) => Promise<SearchAnswer>;
  searchBySense: (body: SenseBody) => Promise<SearchAnswer>;
}

// `random(n)` answers an integer in [0, n); injected so tests can pin the pick.
export interface PickSettings {
  api: QuoteApi;
  logger: Logger;
  random: (n: number) => number;
}

export interface PickInput {
  url: string;
  max: number;
}

// A console URL turned into a request, plus the URL params the tool did not use (pk, cursor, page, unknown keys).
export interface ParsedSearchUrl {
  request: SearchRequest;
  ignored: string[];
}
