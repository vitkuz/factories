import type { RunContext } from '../commands/commands.types.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const runIsIdle: Guard<RunContext> = defineGuard<RunContext>({
  id: 'run-is-idle',
  description: 'The run is IDLE: opened, not started yet.',
})(({ state }) =>
  state.status === 'IDLE'
    ? undefined
    : `the run is ${state.status}, not IDLE: it was started already`,
);
