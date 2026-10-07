import type { CommandInput } from '../commands/commands.types.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const errorGiven: Guard<CommandInput> = defineGuard<CommandInput>({
  id: 'error-given',
  description: 'A failure says what went wrong (--error, not empty).',
})(({ error }) => (error ? undefined : 'fail needs --error "<what went wrong>"'));
