import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { listFiles } from './files';
import { buildStepMap } from './record-processing.utils';

describe('building the step map from a run folder', () => {
  it('lists every file, skips ignored names, and groups them by step', async () => {
    const results: string = await fs.mkdtemp(path.join(os.tmpdir(), 'record-processing-'));
    const run: string = path.join(results, 'uuid-1', 'claude', 'skill', '001');
    await fs.mkdir(path.join(run, '1-extract-core'), { recursive: true });
    await fs.mkdir(path.join(run, '7-filter-and-compress'), { recursive: true });
    await fs.mkdir(path.join(run, 'node_modules'), { recursive: true });
    await Promise.all([
      fs.writeFile(path.join(run, '1-extract-core', 'quote.json'), '{}'),
      fs.writeFile(path.join(run, '1-extract-core', 'semantic-core.json'), '{}'),
      fs.writeFile(path.join(run, '1-extract-core', '.DS_Store'), ''),
      fs.writeFile(path.join(run, '7-filter-and-compress', 'filtered-and-compacted.json'), '{}'),
      fs.writeFile(path.join(run, 'node_modules', 'x.js'), ''),
      fs.writeFile(path.join(run, 'run.json'), '{}'),
    ]);
    try {
      const files: string[] = await listFiles(run);
      assert.deepEqual(buildStepMap({ resultsDir: results, prefix: 'p', runDir: run })(files), {
        '1-extract-core': [
          'p/uuid-1/claude/skill/001/1-extract-core/quote.json',
          'p/uuid-1/claude/skill/001/1-extract-core/semantic-core.json',
        ],
        '7-filter-and-compress': ['p/uuid-1/claude/skill/001/7-filter-and-compress/filtered-and-compacted.json'],
        _run: ['p/uuid-1/claude/skill/001/run.json'],
      });
    } finally {
      await fs.rm(results, { recursive: true, force: true });
    }
  });
});
