import type { Finding, PipelineContext, PipelineRule } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';
import { declaredStarts, reachableFrom } from '../../pipeline/pipeline.utils.js';

export const stepsReachable: PipelineRule = defineRule<PipelineContext>({
  id: 'steps-reachable',
  description: 'Every step can be reached from START.',
})(({ pipeline }, report) => {
  const starts: string[] = declaredStarts(pipeline);
  if (starts.length === 0) return []; // start-exists already says so
  const reached: Set<string> = reachableFrom(pipeline)(starts);
  return Object.keys(pipeline.steps)
    .filter((name: string): boolean => !reached.has(name))
    .map((name: string): Finding => report.error(`steps.${name}: not reachable from START`));
});
