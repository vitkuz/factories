import type { RunContext } from '../commands/commands.types.js';
import { stepNameOf, stepRecordOf } from '../commands/commands.utils.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const stepIsRunning: Guard<RunContext> = defineGuard<RunContext>({
  id: 'step-is-running',
  description: 'The step is RUNNING: start-step recorded it, and nothing closed it since.',
})((context) => {
  const status: string | undefined = stepRecordOf(context)?.status;
  if (status === 'RUNNING') return undefined;
  const hint: string = status === 'PENDING' ? ': start it first' : '';
  return `step "${stepNameOf(context)}" is ${status}, not RUNNING${hint}`;
});
