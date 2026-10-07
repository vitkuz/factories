import type { RunContext } from '../commands/commands.types.js';
import { stepNameOf } from '../commands/commands.utils.js';
import { readinessOf } from '../routing/index.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const fanInReady: Guard<RunContext> = defineGuard<RunContext>({
  id: 'fan-in-ready',
  description:
    'No other live step can still reach the step by forward edges (a fan-in waits for every branch).',
})((context) => {
  const waitsFor: string[] | undefined = readinessOf(context.pipeline)(context.state).waiting[
    stepNameOf(context)
  ];
  return waitsFor === undefined
    ? undefined
    : `step "${stepNameOf(context)}" waits for ${waitsFor.join(', ')} (fan-in): start it when they are done`;
});
