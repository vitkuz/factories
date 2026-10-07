import type { RunContext } from '../commands/commands.types.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';
import { routeFailure } from './route-failure.utils.js';

export const conditionIsValid: Guard<RunContext> = defineGuard<RunContext>({
  id: 'condition-is-valid',
  description:
    "The event's edge condition parses, and every name in it is reported, a param, a constant or a built-in.",
})(routeFailure('bad-condition'));
