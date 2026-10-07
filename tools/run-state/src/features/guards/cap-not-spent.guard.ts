import type { RunContext } from '../commands/commands.types.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';
import { routeFailure } from './route-failure.utils.js';

export const capNotSpent: Guard<RunContext> = defineGuard<RunContext>({
  id: 'cap-not-spent',
  description: 'The edge taken has not used up its max, or it has an onMax to take instead.',
})(routeFailure('cap-spent'));
