// This skill's entry on the quote's `processing` field: per step folder, the S3 keys of the step's result files.
export type StepMap = Record<string, string[]>;
// The quote's `processing` field: per factory (skill) id, any JSON object (other factories store other shapes).
export type Processing = Record<string, Record<string, unknown>>;
// What this tool sends: only its own entry; a step key stored before but absent now is `null` (the API deletes it).
export type EntryPatch = Record<string, string[] | null>;
export type ProcessingPatch = Record<string, EntryPatch>;

// The quote's `category` and `tags` (both optional string arrays).
export interface QuoteMeta {
  category?: string[];
  tags?: string[];
}

// What this tool reads from the run's semantic core (1-extract-core/semantic-core.json).
export interface SemanticCore {
  primaryDomain?: string;
  themes?: string[];
}

export type RunStatus = 'updated' | 'dry-run' | 'api-pending';

export interface CliArgs {
  uuid: string;
  runDir: string;
  skill?: string;
  skipLog: boolean;
  skipMeta: boolean;
  dryRun: boolean;
  help: boolean;
}

// The quote as the API answers it; only the fields this tool reads are typed, the rest passes through.
export interface Quote {
  pk: string;
  uuid: string;
  updatedAt?: string;
  processing?: Processing;
  category?: string[];
  tags?: string[];
  [key: string]: unknown;
}

export interface UpdateBody {
  pk: string;
  patch: { processing: ProcessingPatch } & QuoteMeta;
  skipLog?: true;
}

export interface RunResult {
  uuid: string;
  pk: string;
  skill: string;
  dryRun: boolean;
  status: RunStatus;
  processing: Processing;
  // The quote's `category` and `tags` after the write (expected values on dry-run / api-pending); absent with
  // --skip-meta or when the run has no semantic core.
  meta?: QuoteMeta;
  updatedAt?: string;
  // The body sent (or that would be sent) to quote.updateOneByPk.
  request: UpdateBody;
  // Only on api-pending: why the write was refused.
  message?: string;
  apiMessage?: string;
}

// An API failure, normalized: the HTTP status (absent on a network error), the API's error code and message.
export interface ApiFailure {
  kind: 'api-failure';
  status?: number;
  code: string;
  message: string;
}

export type ApiFailureClass = 'not-found' | 'api-pending' | 'other';

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
  getOneByUuid: (uuid: string) => Promise<Quote>;
  updateOneByPk: (body: UpdateBody) => Promise<Quote>;
}

export interface RecordSettings {
  api: QuoteApi;
  logger: Logger;
  resultsDir: string;
  s3Prefix: string;
}

export interface RecordInput {
  uuid: string;
  runDir: string;
  skill: string;
  skipLog: boolean;
  skipMeta: boolean;
  dryRun: boolean;
}

export interface ErrorOutput {
  error: { code: string; message: string; status?: number };
  request?: UpdateBody;
}

// What the CLI prints on stdout and the exit code: 0 done (updated / dry-run), 1 error, 2 quote not found,
// 3 api-pending.
export interface Outcome {
  exitCode: 0 | 1 | 2 | 3;
  output: RunResult | ErrorOutput;
}
