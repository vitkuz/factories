import type { Finding, PipelineContext, PipelineRule } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';
import { declaredStarts, isStep } from '../../pipeline/pipeline.utils.js';

export const startExists: PipelineRule = defineRule<PipelineContext>({
  id: 'start-exists',
  description: 'Every START entry names a declared step, and at least one does.',
})(({ pipeline }, report) => {
  const unknown: Finding[] = pipeline.START.filter(
    (name: string): boolean => !isStep(pipeline)(name),
  ).map((name: string): Finding => report.error(`START: "${name}" is not a step`));
  const none: Finding[] =
    declaredStarts(pipeline).length === 0
      ? [report.error('START names no declared step, so nothing can run')]
      : [];
  return [...unknown, ...none];
});
