import type { RunContext } from '../commands/commands.types.js';
import { stepNameOf, stepRecordOf } from '../commands/commands.utils.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const stepIsPending: Guard<RunContext> = defineGuard<RunContext>({
  id: 'step-is-pending',
  description: 'The step is PENDING: only a step that has not run can be skipped.',
})((context) => {
  const status: string | undefined = stepRecordOf(context)?.status;
  return status === 'PENDING'
    ? undefined
    : `step "${stepNameOf(context)}" is ${status}: only a PENDING step can be skipped`;
});
