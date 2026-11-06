export type FileStatus = 'uploaded' | 'unchanged' | 'would-upload';

export interface SyncOptions {
  dir: string;
  dryRun: boolean;
}

export interface SyncSettings {
  bucket: string;
  prefix: string;
  resultsDir: string;
}

// One local file to sync: absolute path, path relative to RESULTS_DIR ("/" separators) and its S3 key.
export interface LocalFile {
  absPath: string;
  path: string;
  key: string;
}

export interface FileResult {
  path: string;
  key: string;
  status: FileStatus;
}

export interface SyncResult {
  bucket: string;
  prefix: string;
  dir: string;
  dryRun: boolean;
  uploaded: number;
  unchanged: number;
  files: FileResult[];
}

// Remote object ETags by key (ListObjectsV2 under the dir's key prefix).
export type RemoteEtags = ReadonlyMap<string, string>;

export interface PutObjectInput {
  key: string;
  body: Buffer;
  contentType: string;
  md5Base64: string;
}

export interface S3Adapter {
  headBucket: () => Promise<void>;
  listEtags: (keyPrefix: string) => Promise<RemoteEtags>;
  putObject: (input: PutObjectInput) => Promise<void>;
}

export interface FileSystem {
  listFiles: (target: string) => Promise<string[]>;
  readFile: (absPath: string) => Promise<Buffer>;
}

export interface Logger {
  info: (message: string, meta?: Record<string, unknown>) => void;
  debug: (message: string, meta?: Record<string, unknown>) => void;
}
