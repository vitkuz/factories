import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  buildResult,
  contentTypeFor,
  decideStatus,
  dirKeyPrefix,
  isSkippedName,
  listKeyPrefix,
  md5Base64,
  md5Hex,
  needsUpload,
  normalizePrefix,
  relativeToResults,
  toS3Key,
  unquoteEtag,
} from './sync.utils';
import { FileResult } from './sync.types';

const ROOT: string = '/data/results';
const FILE: string = `${ROOT}/c048f7cb-473c-50f0-94fe-d66a94d71fa5/claude/quote-to-question-v1-factory/001/1-extract-core/quote.json`;
const REL: string = 'c048f7cb-473c-50f0-94fe-d66a94d71fa5/claude/quote-to-question-v1-factory/001/1-extract-core/quote.json';

describe('S3 key rule', () => {
  it('normalizes the prefix', () => {
    assert.equal(normalizePrefix(''), '');
    assert.equal(normalizePrefix('q2q'), 'q2q/');
    assert.equal(normalizePrefix('q2q/'), 'q2q/');
  });

  it('is the path relative to RESULTS_DIR with no prefix', () => {
    assert.equal(toS3Key('')(ROOT)(FILE), REL);
  });

  it('adds the prefix with one slash', () => {
    assert.equal(toS3Key('a/b')(ROOT)(FILE), `a/b/${REL}`);
    assert.equal(toS3Key('a/b/')(ROOT)(FILE), `a/b/${REL}`);
  });

  it('accepts a trailing slash on RESULTS_DIR', () => {
    assert.equal(toS3Key('')(`${ROOT}/`)(FILE), REL);
  });

  it('rejects a path outside RESULTS_DIR', () => {
    assert.throws(() => toS3Key('')(ROOT)('/data/other/x.json'), /outside RESULTS_DIR/);
    assert.throws(() => toS3Key('')(ROOT)('/data/results-other/x.json'), /outside RESULTS_DIR/);
    assert.throws(() => relativeToResults(ROOT)('/data'), /outside RESULTS_DIR/);
  });

  it('keeps a name that only starts with ".." inside RESULTS_DIR', () => {
    assert.equal(relativeToResults(ROOT)(`${ROOT}/..notes.json`), '..notes.json');
    assert.equal(toS3Key('p')(ROOT)(`${ROOT}/q/..x/a.json`), 'p/q/..x/a.json');
  });

  it('lists a dir under its key plus a slash, RESULTS_DIR under the prefix', () => {
    assert.equal(dirKeyPrefix('')(ROOT)(`${ROOT}/abc`), 'abc/');
    assert.equal(dirKeyPrefix('p')(ROOT)(`${ROOT}/abc/claude`), 'p/abc/claude/');
    assert.equal(dirKeyPrefix('')(ROOT)(ROOT), '');
    assert.equal(dirKeyPrefix('p')(ROOT)(ROOT), 'p/');
  });

  it('lists a single-file --dir under its own key', () => {
    assert.equal(listKeyPrefix('p')(ROOT)(FILE, [FILE]), `p/${REL}`);
    assert.equal(listKeyPrefix('p')(ROOT)(`${ROOT}/abc`, [`${ROOT}/abc/x.json`]), 'p/abc/');
    assert.equal(listKeyPrefix('')(ROOT)(`${ROOT}/abc`, []), 'abc/');
  });
});

describe('skip filter', () => {
  it('skips .git, .DS_Store and node_modules only', () => {
    assert.equal(isSkippedName('.git'), true);
    assert.equal(isSkippedName('.DS_Store'), true);
    assert.equal(isSkippedName('node_modules'), true);
    assert.equal(isSkippedName('.gitignore'), false);
    assert.equal(isSkippedName('quote.json'), false);
  });
});

describe('content types', () => {
  it('maps .json and .md, else octet-stream', () => {
    assert.equal(contentTypeFor('a/quote.json'), 'application/json; charset=utf-8');
    assert.equal(contentTypeFor('a/README.MD'), 'text/markdown; charset=utf-8');
    assert.equal(contentTypeFor('a/notes.txt'), 'application/octet-stream');
    assert.equal(contentTypeFor('a/noext'), 'application/octet-stream');
  });
});

describe('MD5 vs ETag', () => {
  const body: Buffer = Buffer.from('hello');
  const md5: string = '5d41402abc4b2a76b9719d911017c592';

  it('hashes the body', () => {
    assert.equal(md5Hex(body), md5);
    assert.equal(md5Base64(body), Buffer.from(md5, 'hex').toString('base64'));
  });

  it('unquotes and lowercases the ETag', () => {
    assert.equal(unquoteEtag(`"${md5.toUpperCase()}"`), md5);
    assert.equal(unquoteEtag(md5), md5);
  });

  it('uploads when missing or different, not when equal', () => {
    assert.equal(needsUpload(md5, undefined), true);
    assert.equal(needsUpload(md5, `"${md5}"`), false);
    assert.equal(needsUpload(md5, '"00000000000000000000000000000000"'), true);
    assert.equal(needsUpload(md5, `"${md5}-2"`), true);
  });

  it('decides the status, would-upload on dry run', () => {
    assert.equal(decideStatus(false)(md5, undefined), 'uploaded');
    assert.equal(decideStatus(true)(md5, undefined), 'would-upload');
    assert.equal(decideStatus(true)(md5, `"${md5}"`), 'unchanged');
    assert.equal(decideStatus(false)(md5, `"${md5}"`), 'unchanged');
  });
});

describe('buildResult', () => {
  it('counts uploaded and unchanged', () => {
    const files: FileResult[] = [
      { path: 'a', key: 'a', status: 'uploaded' },
      { path: 'b', key: 'b', status: 'unchanged' },
      { path: 'c', key: 'c', status: 'would-upload' },
    ];
    assert.deepEqual(buildResult({ bucket: 'b', prefix: '', resultsDir: ROOT })(ROOT, false, files), {
      bucket: 'b',
      prefix: '',
      dir: ROOT,
      dryRun: false,
      uploaded: 1,
      unchanged: 1,
      files,
    });
  });
});
