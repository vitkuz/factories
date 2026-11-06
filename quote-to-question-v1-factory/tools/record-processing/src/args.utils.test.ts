import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseArgs } from './args.utils';

describe('parseArgs', () => {
  it('reads values and flags', () => {
    assert.deepEqual(parseArgs(['--uuid', 'u', '--run-dir', '/r', '--skill', 's', '--skip-log', '--skip-meta', '--dry-run']), {
      uuid: 'u',
      runDir: '/r',
      skill: 's',
      skipLog: true,
      skipMeta: true,
      dryRun: true,
      help: false,
    });
  });
  it('accepts --flag=value and defaults booleans to false', () => {
    assert.deepEqual(parseArgs(['--uuid=u', '--run-dir=/r']), {
      uuid: 'u',
      runDir: '/r',
      skipLog: false,
      skipMeta: false,
      dryRun: false,
      help: false,
    });
  });
  it('throws on an unknown flag or a missing value', () => {
    assert.throws(() => parseArgs(['--nope']), /unknown argument/);
    assert.throws(() => parseArgs(['--uuid']), /needs a value/);
    assert.throws(() => parseArgs(['--uuid', '--dry-run']), /needs a value/);
  });
});
