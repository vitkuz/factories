import type { PipelineContext, PipelineRule } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';
import { wrapperSkillDirFor } from '../../pipeline/pipeline.utils.js';

export const wrapperSkillExists: PipelineRule = defineRule<PipelineContext>({
  id: 'wrapper-skill-exists',
  description:
    'The factory has a wrapper skill at .claude/skills/<id>, where {{skillPath}} resolves.',
})(({ pipeline, rootPath, fileSystem }, report) => {
  const folder: string = wrapperSkillDirFor(rootPath)(pipeline.id);
  return fileSystem.exists(folder)
    ? []
    : [
        report.warning(
          `no wrapper skill folder ${folder}: {{skillPath}} resolves there, and /${pipeline.id} has no skill to hand off to any-factory`,
        ),
      ];
});
