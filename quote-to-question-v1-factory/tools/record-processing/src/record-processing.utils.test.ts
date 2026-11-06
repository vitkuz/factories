import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ApiFailure, Processing, ProcessingPatch, StepMap } from './record-processing.types';
import {
  appendUnique,
  buildStepMap,
  buildUpdateBody,
  classifyApiFailure,
  entryPatch,
  mergeMeta,
  mergeProcessing,
  metaFromCore,
  metaPatch,
  normalizePrefix,
  quotePk,
  redact,
  RUN_LEVEL_KEY,
  s3Key,
  secretsOf,
  stepMapOf,
} from './record-processing.utils';

const RESULTS: string = '/data/results';
const UUID: string = 'c048f7cb-473c-50f0-94fe-d66a94d71fa5';
const RUN: string = `${RESULTS}/${UUID}/claude/quote-to-question-v1-factory/001`;

describe('s3Key (the shared key rule)', () => {
  it('is the path relative to RESULTS_DIR with no prefix', () => {
    assert.equal(
      s3Key(RESULTS)('')(`${RUN}/1-extract-core/quote.json`),
      `${UUID}/claude/quote-to-question-v1-factory/001/1-extract-core/quote.json`,
    );
  });
  it('adds a trailing slash to a prefix that lacks one, keeps one that has it', () => {
    assert.equal(s3Key(RESULTS)('results')(`${RUN}/a.json`), `results/${UUID}/claude/quote-to-question-v1-factory/001/a.json`);
    assert.equal(s3Key(RESULTS)('results/')(`${RUN}/a.json`), `results/${UUID}/claude/quote-to-question-v1-factory/001/a.json`);
    assert.equal(normalizePrefix(''), '');
  });
  it('accepts a RESULTS_DIR with a trailing slash', () => {
    assert.equal(s3Key(`${RESULTS}/`)('')(`${RESULTS}/x/y.json`), 'x/y.json');
  });
  it('throws on a path outside RESULTS_DIR', () => {
    assert.throws(() => s3Key(RESULTS)('')('/elsewhere/file.json'), /outside RESULTS_DIR/);
    assert.throws(() => s3Key(RESULTS)('')(`${RESULTS}/../results-other/file.json`), /outside RESULTS_DIR/);
    assert.throws(() => s3Key(RESULTS)('')(RESULTS), /outside RESULTS_DIR/);
    assert.throws(() => s3Key(RESULTS)('')(`${RESULTS}/..`), /outside RESULTS_DIR/);
  });
  it('accepts a file or folder whose name starts with ".." (same as sync-results-s3)', () => {
    assert.equal(s3Key(RESULTS)('')(`${RUN}/..notes.json`), `${UUID}/claude/quote-to-question-v1-factory/001/..notes.json`);
    assert.equal(s3Key(RESULTS)('')(`${RESULTS}/..hidden/a.json`), '..hidden/a.json');
  });
});

describe('buildStepMap', () => {
  const build: (files: string[]) => StepMap = buildStepMap({ resultsDir: RESULTS, prefix: '', runDir: RUN });
  const key = (rest: string): string => `${UUID}/claude/quote-to-question-v1-factory/001/${rest}`;

  it('groups files by step folder, sorted keys and sorted lists', () => {
    const map: StepMap = build([
      `${RUN}/2-research-historical-context/history-context.json`,
      `${RUN}/1-extract-core/semantic-core.json`,
      `${RUN}/1-extract-core/quote.json`,
    ]);
    assert.deepEqual(map, {
      '1-extract-core': [key('1-extract-core/quote.json'), key('1-extract-core/semantic-core.json')],
      '2-research-historical-context': [key('2-research-historical-context/history-context.json')],
    });
    assert.deepEqual(Object.keys(map), ['1-extract-core', '2-research-historical-context']);
  });
  it('puts files directly in the run folder under _run', () => {
    assert.deepEqual(build([`${RUN}/report.md`, `${RUN}/1-extract-core/quote.json`]), {
      '1-extract-core': [key('1-extract-core/quote.json')],
      [RUN_LEVEL_KEY]: [key('report.md')],
    });
  });
  it('keeps a nested file under its top step folder', () => {
    assert.deepEqual(build([`${RUN}/6-judge-questions/judges/q1.json`]), {
      '6-judge-questions': [key('6-judge-questions/judges/q1.json')],
    });
  });
  it('is empty for no files', () => {
    assert.deepEqual(build([]), {});
  });
});

describe('mergeProcessing', () => {
  const entry: StepMap = { '1-extract-core': ['k1'] };
  it('keeps other skills and replaces this skill', () => {
    const existing: Processing = { 'other-skill': { s: ['x'] }, 'quote-to-question-v1-factory': { old: ['y'] } };
    assert.deepEqual(mergeProcessing(existing)('quote-to-question-v1-factory')(entry), {
      'other-skill': { s: ['x'] },
      'quote-to-question-v1-factory': entry,
    });
    assert.deepEqual(existing['quote-to-question-v1-factory'], { old: ['y'] }, 'does not mutate the input');
  });
  it('starts from nothing when the quote has no processing', () => {
    assert.deepEqual(mergeProcessing(undefined)('s')(entry), { s: entry });
  });
});

describe('entryPatch (the server deep-merges)', () => {
  const entry: StepMap = { '1-extract-core': ['k1'], '2-history': ['k2'] };
  it('sends only this skill, never another factory', () => {
    const stored: Processing = { other: { n: 1, deep: { x: true } } };
    assert.deepEqual(entryPatch(stored)('s')(entry), { s: entry });
  });
  it('adds null for each step stored before but absent now', () => {
    const stored: Processing = { s: { '1-extract-core': ['old'], '9-gone': ['x'], _run: ['r'] } };
    assert.deepEqual(entryPatch(stored)('s')(entry), { s: { ...entry, '9-gone': null, _run: null } });
    assert.deepEqual(stored.s, { '1-extract-core': ['old'], '9-gone': ['x'], _run: ['r'] }, 'does not mutate the input');
  });
  it('starts from nothing when the quote has no processing', () => {
    assert.deepEqual(entryPatch(undefined)('s')(entry), { s: entry });
  });
});

describe('stepMapOf', () => {
  it('returns this skill entry when it is a step map, undefined otherwise; other shapes are ignored', () => {
    const processing: Processing = { s: { a: ['k'] }, other: { n: 1 }, bad: { a: 'k' } };
    assert.deepEqual(stepMapOf(processing)('s'), { a: ['k'] });
    assert.equal(stepMapOf(processing)('bad'), undefined);
    assert.equal(stepMapOf(processing)('missing'), undefined);
    assert.equal(stepMapOf(undefined)('s'), undefined);
  });
});

describe('buildUpdateBody', () => {
  it('sends pk and patch, skipLog only when asked', () => {
    const processing: ProcessingPatch = { s: { a: ['k'], b: null } };
    assert.deepEqual(buildUpdateBody(UUID)(false)(processing), { pk: `quote#${UUID}`, patch: { processing } });
    assert.deepEqual(buildUpdateBody(UUID)(true)(processing), { pk: quotePk(UUID), patch: { processing }, skipLog: true });
  });
});

describe('classifyApiFailure', () => {
  const failure = (status: number | undefined, message: string): ApiFailure => ({
    kind: 'api-failure',
    status,
    code: 'BAD_REQUEST',
    message,
  });
  it('classifies the strict-schema 400 as api-pending', () => {
    assert.equal(classifyApiFailure(failure(400, 'patch: Unrecognized key: "processing"')), 'api-pending');
    assert.equal(classifyApiFailure(failure(400, 'patch: Unrecognized keys: "processing"')), 'api-pending');
    assert.equal(classifyApiFailure(failure(400, 'unknown key processing')), 'api-pending');
  });
  it('classifies 404 as not-found', () => {
    assert.equal(classifyApiFailure(failure(404, 'Quote not found')), 'not-found');
  });
  it('keeps other 400s, 5xx and network errors as other', () => {
    assert.equal(classifyApiFailure(failure(400, 'origin cannot change; delete and create')), 'other');
    assert.equal(classifyApiFailure(failure(500, 'Unrecognized key')), 'other');
    assert.equal(classifyApiFailure(failure(undefined, 'could not be reached')), 'other');
    assert.equal(classifyApiFailure(failure(409, 'modified concurrently')), 'other');
  });
});

describe('secretsOf', () => {
  it('hides the key, the URL and its host (a network error names only the host)', () => {
    const hide: (text: string) => string = redact(secretsOf('KEY123', 'https://api.example.test/prod/'));
    assert.equal(hide('getaddrinfo ENOTFOUND api.example.test'), 'getaddrinfo ENOTFOUND ***');
    assert.equal(hide('GET https://api.example.test/prod/v1 KEY123'), 'GET ***v1 ***');
  });
  it('tolerates a URL that does not parse', () => {
    assert.deepEqual(secretsOf('', 'not a url'), ['not a url']);
  });
});

describe('redact', () => {
  it('hides every secret and ignores empty ones', () => {
    assert.equal(redact(['KEY123', ''])('a KEY123 b KEY123'), 'a *** b ***');
  });
});

describe('category and tags from the semantic core', () => {
  it('takes primaryDomain as the category and the themes, lowercase, as tags', () => {
    assert.deepEqual(metaFromCore({ primaryDomain: 'любовь', themes: ['Любовь', ' время ', '', 'x'.repeat(61)] }), {
      category: ['любовь'],
      tags: ['любовь', 'время'],
    });
  });
  it('never turns the catch-all domain into a category', () => {
    assert.deepEqual(metaFromCore({ primaryDomain: 'другое', themes: [] }), { category: [], tags: [] });
  });
  it('keeps stored items first, skips repeats in any case and stops at the limit', () => {
    assert.deepEqual(appendUnique(3)(['A', 'b'])(['a', 'c', 'd']), ['A', 'b', 'c']);
    assert.deepEqual(appendUnique(1)(['a', 'b'])(['c']), ['a', 'b']);
  });
  it('merges onto the stored values within the API limits (5 categories, 10 tags)', () => {
    const tags: string[] = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9'];
    assert.deepEqual(mergeMeta({ tags })({ primaryDomain: 'любовь', themes: ['любовь', 'время'] }), {
      category: ['любовь'],
      tags: [...tags, 'любовь'],
    });
  });
  it('sends only the fields that change', () => {
    assert.deepEqual(metaPatch({ category: ['любовь'], tags: ['любовь'] })({ category: ['любовь'], tags: ['любовь', 'время'] }), {
      tags: ['любовь', 'время'],
    });
    assert.deepEqual(metaPatch({ category: ['любовь'] })({ category: ['любовь'], tags: [] }), {});
  });
  it('puts the meta fields next to processing in the update body', () => {
    assert.deepEqual(buildUpdateBody(UUID)(false)({}, { category: ['любовь'] }), {
      pk: quotePk(UUID),
      patch: { category: ['любовь'], processing: {} },
    });
  });
});
