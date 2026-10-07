import type { RunContext } from '../commands/commands.types.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';
import { routeFailure } from './route-failure.utils.js';

export const eventIsKnown: Guard<RunContext> = defineGuard<RunContext>({
  id: 'event-is-known',
  description: "The event is one of the step's transitions.",
})(routeFailure('unknown-event'));
