import { describe, expect, it } from 'vitest';
import {
  listPipelineIdsFactory,
  locatePipelineFactory,
  pipelineFileOfIdFactory,
} from '../src/features/pipeline/services/index.js';
import { ROOT, memoryFileSystem } from './helpers.js';

const disk = memoryFileSystem([
  `${ROOT}/factories/shared-factory/pipeline.json`,
  `${ROOT}/factories/both-factory/pipeline.json`,
  `${ROOT}/factories/skills/any-factory/SKILL.md`,
  `${ROOT}/factories.local/local-factory/pipeline.json`,
  `${ROOT}/factories.local/both-factory/pipeline.json`,
  `${ROOT}/factories.local/no-pipeline/README.md`,
  `${ROOT}/elsewhere/pipeline.json`,
]);
const locate = locatePipelineFactory(disk)(ROOT, ROOT);

describe('locating a pipeline', () => {
  it('lists local and shared ids once each, sorted', () => {
    expect(listPipelineIdsFactory(disk)(ROOT)).toEqual([
      'both-factory',
      'local-factory',
      'shared-factory',
    ]);
  });

  it('a local id wins over a shared one', () => {
    expect(pipelineFileOfIdFactory(disk)(ROOT)('both-factory')).toBe(
      `${ROOT}/factories.local/both-factory/pipeline.json`,
    );
    expect(locate('both-factory')).toBe(`${ROOT}/factories.local/both-factory/pipeline.json`);
    expect(locate('shared-factory')).toBe(`${ROOT}/factories/shared-factory/pipeline.json`);
    expect(locate('local-factory')).toBe(`${ROOT}/factories.local/local-factory/pipeline.json`);
  });

  it('takes a path from the working directory', () => {
    expect(locate('elsewhere/pipeline.json')).toBe(`${ROOT}/elsewhere/pipeline.json`);
    expect(locate('elsewhere')).toBe(`${ROOT}/elsewhere/pipeline.json`);
  });

  it('names the ids when nothing matches', () => {
    expect(() => locate('ghost-factory')).toThrow(
      /no pipeline "ghost-factory": expected \/repo\/factories\/ghost-factory\/pipeline.json \(or the same under factories.local\/\).*Available ids: both-factory, local-factory, shared-factory/,
    );
    expect(() => locate(undefined)).toThrow(/name a pipeline: one of both-factory/);
  });
});
