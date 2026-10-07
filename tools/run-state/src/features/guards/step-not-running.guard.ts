import type { RunContext } from '../commands/commands.types.js';
import { stepNameOf, stepRecordOf } from '../commands/commands.utils.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const stepNotRunning: Guard<RunContext> = defineGuard<RunContext>({
  id: 'step-not-running',
  description: 'The step is not running already.',
})((context) =>
  stepRecordOf(context)?.status === 'RUNNING'
    ? `step "${stepNameOf(context)}" is already running`
    : undefined,
);
