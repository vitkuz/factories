import type { StringAt } from '../../pipeline/pipeline.types.js';
import type { Finding, PipelineContext, PipelineRule } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';
import { BUILT_INS, placeholdersIn, stringsIn } from '../../pipeline/pipeline.utils.js';

export const placeholdersDeclared: PipelineRule = defineRule<PipelineContext>({
  id: 'placeholders-declared',
  description: `Every {{name}} is a param, a constant or a built-in (${BUILT_INS.join(', ')}).`,
})(({ pipeline }, report) => {
  const declared: Set<string> = new Set([
    ...Object.keys(pipeline.params ?? {}),
    ...Object.keys(pipeline.constants),
    ...BUILT_INS,
  ]);
  return stringsIn(pipeline).flatMap(([where, text]: StringAt): Finding[] =>
    placeholdersIn(text)
      .filter((name: string): boolean => !declared.has(name))
      .map((name: string): Finding =>
        report.error(
          `${where}: {{${name}}} is not a param, a constant or a built-in (${BUILT_INS.join(', ')})`,
        ),
      ),
  );
});
