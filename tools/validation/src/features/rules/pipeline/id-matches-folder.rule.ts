import path from 'node:path';
import type { PipelineContext, PipelineRule } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';
import { factoriesDirOf, pipelineFileIn } from '../../pipeline/pipeline.utils.js';

export const idMatchesFolder: PipelineRule = defineRule<PipelineContext>({
  id: 'id-matches-folder',
  description:
    'A pipeline under factories/ or factories.local/ sits at <that folder>/<its id>/pipeline.json.',
})(({ pipeline, file, rootPath }, report) => {
  const dir: string | undefined = factoriesDirOf(rootPath, file);
  if (dir === undefined) return [];
  const expected: string = pipelineFileIn(dir)(rootPath)(pipeline.id);
  return path.resolve(file) !== expected
    ? [report.warning(`id "${pipeline.id}" does not match its folder: expected ${expected}`)]
    : [];
});
