import type { RunContext } from '../commands/commands.types.js';
import { activeOf } from '../state/state.utils.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const nothingRunningOnFinish: Guard<RunContext> = defineGuard<RunContext>({
  id: 'nothing-running-on-finish',
  description: 'No step is running.',
})(({ state }) => {
  const running: string[] = activeOf(state);
  return running.length === 0 ? undefined : `step(s) still running: ${running.join(', ')}`;
});
