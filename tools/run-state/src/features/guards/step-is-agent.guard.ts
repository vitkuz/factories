import type { RunContext } from '../commands/commands.types.js';
import { isHumanStep, stepNameOf } from '../commands/commands.utils.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const stepIsAgent: Guard<RunContext> = defineGuard<RunContext>({
  id: 'step-is-agent',
  description: 'The step is an agent step (a human step is recorded with `human`).',
})((context) =>
  isHumanStep(context) ? `step "${stepNameOf(context)}" is a human step: use human` : undefined,
);
