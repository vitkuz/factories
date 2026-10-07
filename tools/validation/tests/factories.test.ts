import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { createFileSystemClient } from '../src/clients/file-system/index.js';
import {
  listPipelineIdsFactory,
  pipelineFileOfIdFactory,
} from '../src/features/pipeline/services/index.js';
import { toJson } from '../src/features/report/index.js';
import { validatePipelineFactory } from '../src/features/validate/index.js';
import type { ValidationReport } from '../src/features/validate/index.js';
import { KIT_ROOT, fixtureProject, installSkills } from './kit.js';
import { basePipeline } from './helpers.js';

const fileSystem = createFileSystemClient();
const LOCAL_ID = 'local-demo-factory';
const localPipeline = JSON.stringify({
  ...basePipeline(),
  $schema: '../../factories/pipeline.schema.json',
  id: LOCAL_ID,
  constants: { ...basePipeline().constants, factoryPath: '{{rootPath}}/factories.local/{{id}}' },
});
const project = fixtureProject({ [LOCAL_ID]: localPipeline });
writeFileSync(
  path.join(project.root, 'factories.local', LOCAL_ID, 'knowledge', 'draft.md'),
  '# draft\n',
);
installSkills(project.root, readdirSync(path.join(KIT_ROOT, 'skills')));
afterAll(() => project.remove());

const ids: string[] = listPipelineIdsFactory(fileSystem)(project.root);
const validate = (id: string): ValidationReport =>
  validatePipelineFactory(fileSystem)({
    rootPath: project.root,
    cwd: project.root,
    homePath: '/home/me',
  })(pipelineFileOfIdFactory(fileSystem)(project.root)(id));

describe('every factory of the kit, seen from a project', () => {
  it('lists the shared ids and the local one', () => {
    expect(ids.length).toBeGreaterThan(1);
    expect(ids).toContain(LOCAL_ID);
    expect(ids).toContain('quick-research-factory');
  });

  it.each(ids)('%s passes with no errors', (id: string) => {
    expect(toJson(validate(id)).errors).toEqual([]);
  });

  it('the local factory is found first and is clean', () => {
    expect(pipelineFileOfIdFactory(fileSystem)(project.root)(LOCAL_ID)).toBe(
      path.join(project.root, 'factories.local', LOCAL_ID, 'pipeline.json'),
    );
    expect(toJson(validate(LOCAL_ID))).toMatchObject({ ok: true, errors: [], warnings: [] });
  });

  it('a local id shadows a shared one', () => {
    mkdirSync(path.join(project.root, 'factories.local', 'quick-research-factory'), {
      recursive: true,
    });
    writeFileSync(
      path.join(project.root, 'factories.local', 'quick-research-factory', 'pipeline.json'),
      localPipeline.replace(LOCAL_ID, 'quick-research-factory'),
    );
    expect(pipelineFileOfIdFactory(fileSystem)(project.root)('quick-research-factory')).toBe(
      path.join(project.root, 'factories.local', 'quick-research-factory', 'pipeline.json'),
    );
    expect(
      listPipelineIdsFactory(fileSystem)(project.root).filter(
        (id) => id === 'quick-research-factory',
      ),
    ).toHaveLength(1);
  });
});
