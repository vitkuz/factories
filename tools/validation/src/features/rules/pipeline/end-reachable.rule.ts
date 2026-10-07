import type { PipelineContext, PipelineRule } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';
import { END, declaredStarts, reachableFrom } from '../../pipeline/pipeline.utils.js';

export const endReachable: PipelineRule = defineRule<PipelineContext>({
  id: 'end-reachable',
  description: 'Some path leads from START to END, so a run can finish.',
})(({ pipeline }, report) => {
  const starts: string[] = declaredStarts(pipeline);
  if (starts.length === 0) return []; // start-exists already says so
  return reachableFrom(pipeline)(starts).has(END)
    ? []
    : [report.error('END is not reachable from START: the run can never finish')];
});
