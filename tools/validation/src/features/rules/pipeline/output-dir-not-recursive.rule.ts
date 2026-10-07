import type { PipelineContext, PipelineRule } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';
import { placeholdersIn } from '../../pipeline/pipeline.utils.js';

export const outputDirNotRecursive: PipelineRule = defineRule<PipelineContext>({
  id: 'output-dir-not-recursive',
  description: '"outputDir" does not use {{outputDir}}, which is resolved from it.',
})(({ pipeline }, report) =>
  placeholdersIn(pipeline.outputDir).includes('outputDir')
    ? [report.error('outputDir cannot use {{outputDir}}: it is resolved from this value')]
    : [],
);
