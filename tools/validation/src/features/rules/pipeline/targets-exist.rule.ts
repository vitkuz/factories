import type { EdgeEntry, Step } from '../../pipeline/pipeline.types.js';
import type { Finding, PipelineContext, PipelineRule } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';
import { END, edgesOf, isStep, stepEntries } from '../../pipeline/pipeline.utils.js';

export const targetsExist: PipelineRule = defineRule<PipelineContext>({
  id: 'targets-exist',
  description: 'Every transition "target" and "onMax" names a step or END.',
})(({ pipeline }, report) => {
  const known = (name: string): boolean => name === END || isStep(pipeline)(name);
  const dangling =
    (where: string) =>
    (names: readonly string[]): Finding[] =>
      names
        .filter((name: string): boolean => !known(name))
        .map((name: string): Finding => report.error(`${where}: "${name}" is not a step or END`));
  return stepEntries(pipeline).flatMap(([name, step]: [string, Step]): Finding[] =>
    edgesOf(step).flatMap(([event, edge]: EdgeEntry): Finding[] => [
      ...dangling(`steps.${name}.transitions.${event}.target`)(edge.target),
      ...dangling(`steps.${name}.transitions.${event}.onMax`)(edge.onMax ?? []),
    ]),
  );
});
