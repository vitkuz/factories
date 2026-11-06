import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';
import { listFiles, walkFiles } from './files';

describe('walkFiles', () => {
  const root: string = mkdtempSync(join(tmpdir(), 'sync-results-s3-'));

  before(() => {
    mkdirSync(join(root, 'q1', 'run', '1-extract-core'), { recursive: true });
    mkdirSync(join(root, '.git', 'objects'), { recursive: true });
    mkdirSync(join(root, 'q1', 'node_modules', 'x'), { recursive: true });
    writeFileSync(join(root, 'q1', 'run', '1-extract-core', 'quote.json'), '{}');
    writeFileSync(join(root, 'q1', 'run', 'summary.md'), '# s');
    writeFileSync(join(root, 'q1', '.DS_Store'), 'x');
    writeFileSync(join(root, '.git', 'objects', 'o'), 'x');
    writeFileSync(join(root, 'q1', 'node_modules', 'x', 'i.js'), 'x');
    writeFileSync(join(root, 'b.json'), '{}');
    writeFileSync(join(root, 'a.json'), '{}');
    symlinkSync(join(root, 'a.json'), join(root, 'link.json'));
  });

  after(() => rmSync(root, { recursive: true, force: true }));

  it('lists regular files sorted, skipping .git, .DS_Store, node_modules and symlinks', async () => {
    const files: string[] = await walkFiles(root);
    assert.deepEqual(
      files.map((file: string): string => file.slice(root.length + 1)),
      ['a.json', 'b.json', 'q1/run/1-extract-core/quote.json', 'q1/run/summary.md'],
    );
  });

  it('treats a single file as its own list', async () => {
    assert.deepEqual(await listFiles(join(root, 'a.json')), [join(root, 'a.json')]);
  });
});
