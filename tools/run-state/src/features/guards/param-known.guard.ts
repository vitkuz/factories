import type { OpenContext } from '../commands/commands.types.js';
import { declaredParams, unknownParams } from '../commands/params.utils.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const paramKnown: Guard<OpenContext> = defineGuard<OpenContext>({
  id: 'param-known',
  description: 'Every --param names a param the pipeline declares.',
})(({ pipeline, input }) => {
  const unknown: string[] = unknownParams(pipeline, input.params);
  const declared: string = Object.keys(declaredParams(pipeline)).join(', ') || 'none';
  return unknown.length === 0
    ? undefined
    : `unknown param(s): ${unknown.join(', ')} — ${pipeline.id} declares ${declared}`;
});
