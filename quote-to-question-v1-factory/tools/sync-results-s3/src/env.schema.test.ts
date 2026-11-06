import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { Env, envSchema } from './env.schema';

const BASE: Record<string, string> = {
  AWS_PROFILE: 'personal',
  AWS_REGION: 'us-east-1',
  S3_BUCKET: 'bucket-x',
  RESULTS_DIR: '/data/results',
};

describe('envSchema', () => {
  it('defaults S3_PREFIX and LOG_LEVEL', () => {
    const env: Env = envSchema.parse(BASE);
    assert.equal(env.S3_PREFIX, '');
    assert.equal(env.LOG_LEVEL, 'info');
  });

  it('rejects a relative RESULTS_DIR (it would resolve against the cwd)', () => {
    assert.throws(() => envSchema.parse({ ...BASE, RESULTS_DIR: 'repos/quotes-to-question' }), /absolute/);
  });

  it('rejects a missing bucket name', () => {
    assert.throws(() => envSchema.parse({ ...BASE, S3_BUCKET: undefined }));
  });
});
