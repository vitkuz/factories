import type { RunContext } from '../commands/commands.types.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';
import { routeFailure } from './route-failure.utils.js';

export const fallbackExists: Guard<RunContext> = defineGuard<RunContext>({
  id: 'fallback-exists',
  description:
    "When the event's condition is false, the step has an edge without a condition to take instead.",
})(routeFailure('no-fallback'));
