import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { ApiFailure, Logger, Outcome, Quote, QuoteApi, RunResult, UpdateBody } from './record-processing.types';
import { API_PENDING_MESSAGE, recordProcessing } from './record-processing.usecase';

const UUID: string = 'c048f7cb-473c-50f0-94fe-d66a94d71fa5';
const SKILL: string = 'quote-to-question-v1-factory';
const silent: Logger = { debug: () => undefined, info: () => undefined, warn: () => undefined, error: () => undefined };
const apiFailure = (status: number, message: string): ApiFailure => ({ kind: 'api-failure', status, code: 'BAD_REQUEST', message });
const quote: Quote = { pk: `quote#${UUID}`, uuid: UUID, processing: { other: { s: ['x'] } } };

describe('recordProcessing', () => {
  let results: string = '';
  let run: string = '';
  before(async () => {
    results = await fs.mkdtemp(path.join(os.tmpdir(), 'record-processing-uc-'));
    run = path.join(results, UUID, 'claude', SKILL, '001');
    await fs.mkdir(path.join(run, '1-extract-core'), { recursive: true });
    await fs.writeFile(path.join(run, '1-extract-core', 'quote.json'), '{}');
  });
  after(async () => {
    await fs.rm(results, { recursive: true, force: true });
  });

  const runWith = (api: QuoteApi, dryRun: boolean, runDir: string = run, skipMeta: boolean = false): Promise<Outcome> =>
    recordProcessing({ api, logger: silent, resultsDir: results, s3Prefix: '' })({
      uuid: UUID,
      runDir,
      skill: SKILL,
      skipLog: false,
      skipMeta,
      dryRun,
    });

  const runWithCore = async (name: string, core: string): Promise<string> => {
    const dir: string = path.join(results, UUID, 'claude', SKILL, name);
    await fs.mkdir(path.join(dir, '1-extract-core'), { recursive: true });
    await fs.writeFile(path.join(dir, '1-extract-core', 'semantic-core.json'), core);
    return dir;
  };

  it('adds the semantic core category and themes to the stored category and tags', async () => {
    const dir: string = await runWithCore('002', JSON.stringify({ primaryDomain: 'любовь', themes: ['Любовь', 'время'] }));
    const sent: UpdateBody[] = [];
    const stored: Quote = { ...quote, tags: ['любовь'] };
    const api: QuoteApi = {
      getOneByUuid: async (): Promise<Quote> => stored,
      updateOneByPk: async (body: UpdateBody): Promise<Quote> => {
        sent.push(body);
        return { ...stored, processing: body.patch.processing, category: body.patch.category, tags: body.patch.tags };
      },
    };
    const outcome: Outcome = await runWith(api, false, dir);
    assert.equal(outcome.exitCode, 0);
    assert.deepEqual(sent[0].patch.category, ['любовь']);
    assert.deepEqual(sent[0].patch.tags, ['любовь', 'время']);
    assert.deepEqual((outcome.output as RunResult).meta, { category: ['любовь'], tags: ['любовь', 'время'] });
  });

  it('with --skip-meta sends processing only', async () => {
    const dir: string = await runWithCore('003', JSON.stringify({ primaryDomain: 'любовь', themes: ['время'] }));
    const sent: UpdateBody[] = [];
    const api: QuoteApi = {
      getOneByUuid: async (): Promise<Quote> => quote,
      updateOneByPk: async (body: UpdateBody): Promise<Quote> => {
        sent.push(body);
        return { ...quote, processing: body.patch.processing };
      },
    };
    const outcome: Outcome = await runWith(api, false, dir, true);
    assert.equal(outcome.exitCode, 0);
    assert.deepEqual(Object.keys(sent[0].patch), ['processing']);
    assert.equal((outcome.output as RunResult).meta, undefined);
  });

  it('exits 1 BAD_INPUT on a semantic core that is not JSON, before any API call', async () => {
    const dir: string = await runWithCore('004', '{ not json');
    const api: QuoteApi = {
      getOneByUuid: async (): Promise<Quote> => assert.fail('must not read'),
      updateOneByPk: async (): Promise<Quote> => assert.fail('must not write'),
    };
    const outcome: Outcome = await runWith(api, false, dir);
    assert.equal(outcome.exitCode, 1);
    assert.equal((outcome.output as { error: { code: string } }).error.code, 'BAD_INPUT');
  });

  it('returns exit 3 api-pending with the attempted payload on the strict-schema 400', async () => {
    const sent: UpdateBody[] = [];
    const api: QuoteApi = {
      getOneByUuid: async (): Promise<Quote> => quote,
      updateOneByPk: async (body: UpdateBody): Promise<Quote> => {
        sent.push(body);
        throw apiFailure(400, 'patch: Unrecognized key: "processing"');
      },
    };
    const outcome: Outcome = await runWith(api, false);
    const output: RunResult = outcome.output as RunResult;
    assert.equal(outcome.exitCode, 3);
    assert.equal(output.status, 'api-pending');
    assert.equal(output.message, API_PENDING_MESSAGE);
    assert.deepEqual(output.request, sent[0]);
    assert.deepEqual(sent[0].patch.processing, {
      [SKILL]: { '1-extract-core': [`${UUID}/claude/${SKILL}/001/1-extract-core/quote.json`] },
    });
    assert.deepEqual(output.processing, {
      other: { s: ['x'] },
      [SKILL]: { '1-extract-core': [`${UUID}/claude/${SKILL}/001/1-extract-core/quote.json`] },
    });
  });

  it('dry-run reads the quote and never writes', async () => {
    const api: QuoteApi = {
      getOneByUuid: async (): Promise<Quote> => quote,
      updateOneByPk: async (): Promise<Quote> => assert.fail('must not write'),
    };
    const outcome: Outcome = await runWith(api, true);
    assert.equal(outcome.exitCode, 0);
    assert.equal((outcome.output as RunResult).status, 'dry-run');
  });

  it('exits 2 when the quote does not exist', async () => {
    const api: QuoteApi = {
      getOneByUuid: async (): Promise<Quote> => {
        throw apiFailure(404, 'not found');
      },
      updateOneByPk: async (): Promise<Quote> => assert.fail('must not write'),
    };
    assert.equal((await runWith(api, false)).exitCode, 2);
  });

  it('exits 1 on another 400', async () => {
    const api: QuoteApi = {
      getOneByUuid: async (): Promise<Quote> => quote,
      updateOneByPk: async (): Promise<Quote> => {
        throw apiFailure(409, 'modified concurrently');
      },
    };
    assert.equal((await runWith(api, false)).exitCode, 1);
  });

  it('sends null for a stale step of this skill and never another factory entry', async () => {
    const sent: UpdateBody[] = [];
    const stored: Quote = { ...quote, processing: { other: { n: 1, deep: { x: true } }, [SKILL]: { '9-gone': ['old'] } } };
    const api: QuoteApi = {
      getOneByUuid: async (): Promise<Quote> => stored,
      updateOneByPk: async (body: UpdateBody): Promise<Quote> => {
        sent.push(body);
        return { ...stored, processing: { other: { n: 1, deep: { x: true } }, [SKILL]: { '1-extract-core': ['k'] } } };
      },
    };
    const outcome: Outcome = await runWith(api, false);
    assert.equal(outcome.exitCode, 0);
    assert.deepEqual(sent[0].patch.processing, {
      [SKILL]: { '1-extract-core': [`${UUID}/claude/${SKILL}/001/1-extract-core/quote.json`], '9-gone': null },
    });
    assert.deepEqual((outcome.output as RunResult).processing, {
      other: { n: 1, deep: { x: true } },
      [SKILL]: { '1-extract-core': ['k'] },
    });
  });

  it('exits 1 BAD_ANSWER when the answered entry of this skill is not a step map', async () => {
    const api: QuoteApi = {
      getOneByUuid: async (): Promise<Quote> => quote,
      updateOneByPk: async (): Promise<Quote> => ({ ...quote, processing: { [SKILL]: { s: 'not-a-list' } } }),
    };
    const outcome: Outcome = await runWith(api, false);
    assert.equal(outcome.exitCode, 1);
    assert.equal((outcome.output as { error: { code: string } }).error.code, 'BAD_ANSWER');
  });

  it('answers updated with updatedAt on success', async () => {
    const api: QuoteApi = {
      getOneByUuid: async (): Promise<Quote> => quote,
      updateOneByPk: async (body: UpdateBody): Promise<Quote> => ({
        ...quote,
        processing: body.patch.processing,
        updatedAt: '2026-10-10T00:00:00.000Z',
      }),
    };
    const outcome: Outcome = await runWith(api, false);
    assert.equal(outcome.exitCode, 0);
    assert.equal((outcome.output as RunResult).updatedAt, '2026-10-10T00:00:00.000Z');
  });
});
