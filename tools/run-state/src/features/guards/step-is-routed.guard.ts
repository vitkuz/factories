import type { RunContext } from '../commands/commands.types.js';
import { stepNameOf } from '../commands/commands.utils.js';
import { frontierOf } from '../state/state.utils.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const stepIsRouted: Guard<RunContext> = defineGuard<RunContext>({
  id: 'step-is-routed',
  description: 'Something routed the run to the step: it is on the frontier (START, or a target).',
})((context) =>
  frontierOf(context.state).includes(stepNameOf(context))
    ? undefined
    : `step "${stepNameOf(context)}" is not routed to: nothing sent the run there`,
);
