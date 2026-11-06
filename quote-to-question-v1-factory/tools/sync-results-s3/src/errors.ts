// Exit codes: 0 ok, 1 any other error, 2 bucket missing.
export const EXIT_CODE: { ok: number; error: number; bucketMissing: number } = { ok: 0, error: 1, bucketMissing: 2 };

export interface ToolError extends Error {
  code: string;
  exitCode: number;
}

export const toolError = (code: string, message: string, exitCode: number): ToolError =>
  Object.assign(new Error(message), { name: 'ToolError', code, exitCode });

export const isToolError = (error: unknown): error is ToolError =>
  error instanceof Error && error.name === 'ToolError' && typeof (error as ToolError).exitCode === 'number';

export const bucketMissingError = (bucket: string): ToolError =>
  toolError('BUCKET_MISSING', `bucket ${bucket} does not exist; creating it is out of scope`, EXIT_CODE.bucketMissing);

interface AwsSdkError extends Error {
  $metadata?: { httpStatusCode?: number };
}

// HeadBucket answers a bare 404 ("NotFound"); other calls name it NoSuchBucket.
export const isBucketMissing = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }
  const status: number | undefined = (error as AwsSdkError).$metadata?.httpStatusCode;
  return error.name === 'NoSuchBucket' || error.name === 'NotFound' || status === 404;
};

export interface ErrorBody {
  code: string;
  message: string;
}

// Any thrown value -> the `{ error }` body. Never a stack or a credential.
export const toErrorBody = (error: unknown): ErrorBody =>
  isToolError(error)
    ? { code: error.code, message: error.message }
    : error instanceof Error
      ? { code: error.name || 'INTERNAL', message: error.message }
      : { code: 'INTERNAL', message: String(error) };

export const exitCodeOf = (error: unknown): number => (isToolError(error) ? error.exitCode : EXIT_CODE.error);
