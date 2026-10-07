import type { RunContext } from '../commands/commands.types.js';
import { isHumanStep, stepNameOf } from '../commands/commands.utils.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const stepIsHuman: Guard<RunContext> = defineGuard<RunContext>({
  id: 'step-is-human',
  description:
    'The step is a human step (agent: "human"); an agent step is recorded with `step-done`.',
})((context) =>
  isHumanStep(context)
    ? undefined
    : `step "${stepNameOf(context)}" is not a human step: use step-done`,
);
