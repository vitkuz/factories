import {
  _Object,
  HeadBucketCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-providers';
import { bucketMissingError, isBucketMissing } from './errors';
import { Logger, PutObjectInput, RemoteEtags, S3Adapter } from './sync.types';

export interface S3AdapterSettings {
  profile: string;
  region: string;
  bucket: string;
  logger: Logger;
}

const rethrowBucketMissing =
  (bucket: string) =>
  (error: unknown): never => {
    throw isBucketMissing(error) ? bucketMissingError(bucket) : error;
  };

export const headBucketFactory = (client: S3Client, settings: S3AdapterSettings) => async (): Promise<void> => {
  settings.logger.debug('s3 HeadBucket', { bucket: settings.bucket });
  await client.send(new HeadBucketCommand({ Bucket: settings.bucket })).catch(rethrowBucketMissing(settings.bucket));
};

const toEntries = (objects: _Object[]): [string, string][] =>
  objects
    .filter((object: _Object): boolean => object.Key !== undefined && object.ETag !== undefined)
    .map((object: _Object): [string, string] => [object.Key as string, object.ETag as string]);

const listPage =
  (client: S3Client, settings: S3AdapterSettings, keyPrefix: string) =>
  async (token: string | undefined, acc: [string, string][]): Promise<[string, string][]> => {
    const page: ListObjectsV2CommandOutput = await client
      .send(new ListObjectsV2Command({ Bucket: settings.bucket, Prefix: keyPrefix, ContinuationToken: token }))
      .catch(rethrowBucketMissing(settings.bucket));
    const next: [string, string][] = [...acc, ...toEntries(page.Contents ?? [])];
    settings.logger.debug('s3 ListObjectsV2 page', { prefix: keyPrefix, count: page.KeyCount ?? 0, truncated: page.IsTruncated === true });
    return page.IsTruncated === true && page.NextContinuationToken !== undefined
      ? listPage(client, settings, keyPrefix)(page.NextContinuationToken, next)
      : next;
  };

export const listEtagsFactory =
  (client: S3Client, settings: S3AdapterSettings) =>
  async (keyPrefix: string): Promise<RemoteEtags> =>
    new Map(await listPage(client, settings, keyPrefix)(undefined, []));

export const putObjectFactory =
  (client: S3Client, settings: S3AdapterSettings) =>
  async (input: PutObjectInput): Promise<void> => {
    settings.logger.debug('s3 PutObject', { key: input.key, bytes: input.body.length, contentType: input.contentType });
    await client
      .send(
        new PutObjectCommand({
          Bucket: settings.bucket,
          Key: input.key,
          Body: input.body,
          ContentType: input.contentType,
          ContentMD5: input.md5Base64,
        }),
      )
      .catch(rethrowBucketMissing(settings.bucket));
  };

export const createS3Adapter = (settings: S3AdapterSettings): S3Adapter => {
  const client: S3Client = new S3Client({ region: settings.region, credentials: fromIni({ profile: settings.profile }) });
  return {
    headBucket: headBucketFactory(client, settings),
    listEtags: listEtagsFactory(client, settings),
    putObject: putObjectFactory(client, settings),
  };
};
