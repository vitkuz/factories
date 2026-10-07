import path from 'node:path';
import type { PipelineContext, PipelineRule } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';
import { sharedSchemaFor } from '../../pipeline/pipeline.utils.js';

/** Relative from the pipeline when it sits in the repository, absolute when it sits far away. */
const expectedRef = (file: string, schema: string): string => {
  const relative: string = path.relative(path.dirname(file), schema).split(path.sep).join('/');
  return relative.startsWith('../../..') ? schema : relative;
};

export const schemaRef: PipelineRule = defineRule<PipelineContext>({
  id: 'schema-ref',
  description: '"$schema" points at the shared pipeline.schema.json, for editor autocomplete.',
})(({ pipeline, file, rootPath }, report) => {
  const schema: string = sharedSchemaFor(rootPath);
  const declared: string | undefined =
    pipeline.$schema === undefined ? undefined : path.resolve(path.dirname(file), pipeline.$schema);
  return declared === schema
    ? []
    : [
        report.warning(
          `"$schema" should point at the shared schema ("${expectedRef(file, schema)}"), got ${JSON.stringify(pipeline.$schema)}`,
        ),
      ];
});
