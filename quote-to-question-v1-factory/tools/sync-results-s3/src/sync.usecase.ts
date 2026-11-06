import {
  FileResult,
  FileStatus,
  FileSystem,
  LocalFile,
  Logger,
  RemoteEtags,
  S3Adapter,
  SyncOptions,
  SyncResult,
  SyncSettings,
} from './sync.types';
import { buildResult, contentTypeFor, decideStatus, listKeyPrefix, md5Base64, md5Hex, relativeToResults, toS3Key } from './sync.utils';

export interface SyncDeps {
  settings: SyncSettings;
  s3: S3Adapter;
  fs: FileSystem;
  logger: Logger;
}

const toLocalFile =
  (settings: SyncSettings) =>
  (absPath: string): LocalFile => ({
    absPath,
    path: relativeToResults(settings.resultsDir)(absPath),
    key: toS3Key(settings.prefix)(settings.resultsDir)(absPath),
  });

const syncFile =
  (deps: SyncDeps, remote: RemoteEtags, dryRun: boolean) =>
  async (file: LocalFile): Promise<FileResult> => {
    const body: Buffer = await deps.fs.readFile(file.absPath);
    const status: FileStatus = decideStatus(dryRun)(md5Hex(body), remote.get(file.key));
    if (status === 'uploaded') {
      await deps.s3.putObject({ key: file.key, body, contentType: contentTypeFor(file.absPath), md5Base64: md5Base64(body) });
    }
    deps.logger.debug('file', { path: file.path, status });
    return { path: file.path, key: file.key, status };
  };

// Sequential on purpose: one PUT at a time keeps the log readable and the request rate low.
const syncAll =
  (deps: SyncDeps, remote: RemoteEtags, dryRun: boolean) =>
  async (files: LocalFile[]): Promise<FileResult[]> =>
    files.reduce(
      async (acc: Promise<FileResult[]>, file: LocalFile): Promise<FileResult[]> => [
        ...(await acc),
        await syncFile(deps, remote, dryRun)(file),
      ],
      Promise.resolve([]),
    );

// Upload every file under `dir` that is missing remotely or whose MD5 differs from the object's ETag. Never deletes.
export const syncResultsFactory =
  (deps: SyncDeps) =>
  async (options: SyncOptions): Promise<SyncResult> => {
    const paths: string[] = await deps.fs.listFiles(options.dir);
    const files: LocalFile[] = paths.map(toLocalFile(deps.settings));
    await deps.s3.headBucket();
    const keyPrefix: string = listKeyPrefix(deps.settings.prefix)(deps.settings.resultsDir)(options.dir, paths);
    const remote: RemoteEtags = await deps.s3.listEtags(keyPrefix);
    deps.logger.info('sync start', { keyPrefix, local: files.length, remote: remote.size, dryRun: options.dryRun });
    const results: FileResult[] = await syncAll(deps, remote, options.dryRun)(files);
    const result: SyncResult = buildResult(deps.settings)(options.dir, options.dryRun, results);
    deps.logger.info('sync done', { uploaded: result.uploaded, unchanged: result.unchanged, total: results.length });
    return result;
  };
