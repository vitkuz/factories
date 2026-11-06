import { createHash } from 'node:crypto';
import { extname, isAbsolute, relative, sep } from 'node:path';
import { FileResult, FileStatus, SyncResult, SyncSettings } from './sync.types';

export const SKIPPED_NAMES: readonly string[] = ['.git', '.DS_Store', 'node_modules'];

export const isSkippedName = (name: string): boolean => SKIPPED_NAMES.includes(name);

// S3_PREFIX with a trailing "/" when non-empty; empty stays empty.
export const normalizePrefix = (prefix: string): string => (prefix === '' || prefix.endsWith('/') ? prefix : `${prefix}/`);

// The path of `absPath` relative to RESULTS_DIR with "/" separators; outside RESULTS_DIR is an error.
export const relativeToResults =
  (resultsDir: string) =>
  (absPath: string): string => {
    const rel: string = relative(resultsDir, absPath);
    if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
      throw new Error(`path ${absPath} is outside RESULTS_DIR ${resultsDir}`);
    }
    return rel.split(sep).join('/');
  };

// The S3 key rule: normalized S3_PREFIX + path relative to RESULTS_DIR.
export const toS3Key =
  (prefix: string) =>
  (resultsDir: string) =>
  (absPath: string): string =>
    `${normalizePrefix(prefix)}${relativeToResults(resultsDir)(absPath)}`;

// The key prefix to list for a dir: its key plus "/" (so "abc" does not match "abc-other"); RESULTS_DIR itself -> S3_PREFIX.
export const dirKeyPrefix =
  (prefix: string) =>
  (resultsDir: string) =>
  (absDir: string): string => {
    const rel: string = relativeToResults(resultsDir)(absDir);
    return rel === '' ? normalizePrefix(prefix) : `${normalizePrefix(prefix)}${rel}/`;
  };

// The key prefix to list for --dir: a single file (listFiles returned the target itself) lists its own key, a dir its dir prefix.
export const listKeyPrefix =
  (prefix: string) =>
  (resultsDir: string) =>
  (target: string, files: string[]): string =>
    files.length === 1 && files[0] === target ? toS3Key(prefix)(resultsDir)(target) : dirKeyPrefix(prefix)(resultsDir)(target);

const CONTENT_TYPES: Readonly<Record<string, string>> = {
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

export const contentTypeFor = (path: string): string => CONTENT_TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream';

export const md5Hex = (body: Buffer): string => createHash('md5').update(body).digest('hex');

export const md5Base64 = (body: Buffer): string => createHash('md5').update(body).digest('base64');

// S3 returns the ETag quoted; a multipart ETag ("<hash>-<parts>") never equals a plain MD5.
export const unquoteEtag = (etag: string): string => etag.replace(/^"|"$/g, '').toLowerCase();

export const needsUpload = (localMd5: string, remoteEtag: string | undefined): boolean =>
  remoteEtag === undefined || unquoteEtag(remoteEtag) !== localMd5.toLowerCase();

export const decideStatus =
  (dryRun: boolean) =>
  (localMd5: string, remoteEtag: string | undefined): FileStatus =>
    !needsUpload(localMd5, remoteEtag) ? 'unchanged' : dryRun ? 'would-upload' : 'uploaded';

export const buildResult =
  (settings: SyncSettings) =>
  (dir: string, dryRun: boolean, files: FileResult[]): SyncResult => ({
    bucket: settings.bucket,
    prefix: settings.prefix,
    dir,
    dryRun,
    uploaded: files.filter((file: FileResult): boolean => file.status === 'uploaded').length,
    unchanged: files.filter((file: FileResult): boolean => file.status === 'unchanged').length,
    files,
  });
