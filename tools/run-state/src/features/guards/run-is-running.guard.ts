import type { RunContext } from '../commands/commands.types.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const runIsRunning: Guard<RunContext> = defineGuard<RunContext>({
  id: 'run-is-running',
  description: 'The run is RUNNING: started, not finished or failed.',
})(({ state }) =>
  state.status === 'RUNNING' ? undefined : `the run is ${state.status}, not RUNNING`,
);
