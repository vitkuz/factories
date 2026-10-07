import type { RunContext } from '../commands/commands.types.js';
import { frontierOf } from '../state/state.utils.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const nothingRoutedOnFinish: Guard<RunContext> = defineGuard<RunContext>({
  id: 'nothing-routed-on-finish',
  description: 'No routed step is waiting to run (run it or skip it first).',
})(({ state }) => {
  const routed: string[] = frontierOf(state);
  return routed.length === 0
    ? undefined
    : `step(s) routed to but not run: ${routed.join(', ')} (run them or skip them)`;
});
