import type { OpenContext } from '../commands/commands.types.js';
import { paramOutcomes } from '../commands/params.utils.js';
import type { Scalar } from '../pipeline/pipeline.types.js';
import type { Outcome } from '../routing/index.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const paramFitsType: Guard<OpenContext> = defineGuard<OpenContext>({
  id: 'param-fits-type',
  description:
    "Every --param value takes its default's type (a number for a number, a whole number for an integer, true/false/1/0/yes/no for a boolean).",
})(({ pipeline, input }) => {
  const failed: [string, Outcome<Scalar>] | undefined = paramOutcomes(pipeline, input.params).find(
    ([, outcome]: [string, Outcome<Scalar>]): boolean => !outcome.ok,
  );
  return failed === undefined || failed[1].ok ? undefined : failed[1].error;
});
