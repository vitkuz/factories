import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { bucketMissingError, exitCodeOf, isBucketMissing } from './errors';
import { syncResultsFactory } from './sync.usecase';
import { FileSystem, Logger, PutObjectInput, RemoteEtags, S3Adapter, SyncResult } from './sync.types';
import { md5Hex } from './sync.utils';

const ROOT: string = '/r';
const FILES: Record<string, string> = { '/r/q/a.json': '{"a":1}', '/r/q/b.md': '# b', '/r/q/c.bin': 'c' };

const fakeFs: FileSystem = {
  listFiles: async (): Promise<string[]> => Object.keys(FILES),
  readFile: async (absPath: string): Promise<Buffer> => Buffer.from(FILES[absPath]),
};

const silent: Logger = { info: (): void => undefined, debug: (): void => undefined };

const fakeS3 = (remote: RemoteEtags, puts: PutObjectInput[], listed: string[]): S3Adapter => ({
  headBucket: async (): Promise<void> => undefined,
  listEtags: async (keyPrefix: string): Promise<RemoteEtags> => {
    listed.push(keyPrefix);
    return remote;
  },
  putObject: async (input: PutObjectInput): Promise<void> => {
    puts.push(input);
  },
});

const REMOTE: RemoteEtags = new Map([
  ['p/q/a.json', `"${md5Hex(Buffer.from('{"a":1}'))}"`],
  ['p/q/b.md', '"stale"'],
]);

describe('syncResults', () => {
  it('uploads missing and changed files, keeps equal ones', async () => {
    const puts: PutObjectInput[] = [];
    const listed: string[] = [];
    const result: SyncResult = await syncResultsFactory({
      settings: { bucket: 'bk', prefix: 'p', resultsDir: ROOT },
      s3: fakeS3(REMOTE, puts, listed),
      fs: fakeFs,
      logger: silent,
    })({ dir: '/r/q', dryRun: false });
    assert.deepEqual(listed, ['p/q/']);
    assert.equal(result.uploaded, 2);
    assert.equal(result.unchanged, 1);
    assert.deepEqual(
      result.files.map((file) => [file.path, file.key, file.status]),
      [
        ['q/a.json', 'p/q/a.json', 'unchanged'],
        ['q/b.md', 'p/q/b.md', 'uploaded'],
        ['q/c.bin', 'p/q/c.bin', 'uploaded'],
      ],
    );
    assert.deepEqual(
      puts.map((put: PutObjectInput) => [put.key, put.contentType]),
      [
        ['p/q/b.md', 'text/markdown; charset=utf-8'],
        ['p/q/c.bin', 'application/octet-stream'],
      ],
    );
  });

  it('puts nothing on a dry run', async () => {
    const puts: PutObjectInput[] = [];
    const result: SyncResult = await syncResultsFactory({
      settings: { bucket: 'bk', prefix: 'p', resultsDir: ROOT },
      s3: fakeS3(REMOTE, puts, []),
      fs: fakeFs,
      logger: silent,
    })({ dir: '/r/q', dryRun: true });
    assert.equal(puts.length, 0);
    assert.equal(result.uploaded, 0);
    assert.deepEqual(
      result.files.map((file) => file.status),
      ['unchanged', 'would-upload', 'would-upload'],
    );
  });
});

describe('syncResults on a single file', () => {
  it('lists the file key and keeps an equal file unchanged', async () => {
    const puts: PutObjectInput[] = [];
    const listed: string[] = [];
    const oneFile: FileSystem = { ...fakeFs, listFiles: async (target: string): Promise<string[]> => [target] };
    const result: SyncResult = await syncResultsFactory({
      settings: { bucket: 'bk', prefix: 'p', resultsDir: ROOT },
      s3: fakeS3(REMOTE, puts, listed),
      fs: oneFile,
      logger: silent,
    })({ dir: '/r/q/a.json', dryRun: false });
    assert.deepEqual(listed, ['p/q/a.json']);
    assert.equal(puts.length, 0);
    assert.deepEqual(
      result.files.map((file) => file.status),
      ['unchanged'],
    );
  });
});

describe('bucket missing', () => {
  it('recognizes NoSuchBucket, NotFound and a 404', () => {
    assert.equal(isBucketMissing(Object.assign(new Error('x'), { name: 'NoSuchBucket' })), true);
    assert.equal(isBucketMissing(Object.assign(new Error('x'), { name: 'NotFound' })), true);
    assert.equal(isBucketMissing(Object.assign(new Error('x'), { $metadata: { httpStatusCode: 404 } })), true);
    assert.equal(isBucketMissing(Object.assign(new Error('x'), { name: 'Forbidden', $metadata: { httpStatusCode: 403 } })), false);
  });

  it('exits 2 with the clear message; other errors exit 1', () => {
    assert.equal(bucketMissingError('bk').message, 'bucket bk does not exist; creating it is out of scope');
    assert.equal(exitCodeOf(bucketMissingError('bk')), 2);
    assert.equal(exitCodeOf(new Error('boom')), 1);
  });
});
