import type { OpenContext } from '../commands/commands.types.js';
import { paramsOf } from '../commands/params.utils.js';
import type { Scalar } from '../pipeline/pipeline.types.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const paramHasValue: Guard<OpenContext> = defineGuard<OpenContext>({
  id: 'param-has-value',
  description:
    'Every param has a value: a default in pipeline.json, or a --param (an empty default means "ask").',
})(({ pipeline, input }) => {
  const missing: string[] = Object.entries(paramsOf(pipeline, input.params))
    .filter(([, value]: [string, Scalar]): boolean => value === '')
    .map(([name]: [string, Scalar]): string => name);
  return missing.length === 0
    ? undefined
    : `param(s) with no default and no value: ${missing.join(', ')} (ask the user, then pass --param name=value)`;
});
