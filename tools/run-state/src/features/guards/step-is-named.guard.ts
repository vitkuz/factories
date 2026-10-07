import type { RunContext } from '../commands/commands.types.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const stepIsNamed: Guard<RunContext> = defineGuard<RunContext>({
  id: 'step-is-named',
  description: 'The command names a step.',
})(({ input }) => (input.step ? undefined : 'name the step'));
