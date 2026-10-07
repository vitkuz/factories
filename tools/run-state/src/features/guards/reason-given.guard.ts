import type { CommandInput } from '../commands/commands.types.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const reasonGiven: Guard<CommandInput> = defineGuard<CommandInput>({
  id: 'reason-given',
  description: 'A skip says why the step will not run (--reason, not empty).',
})(({ reason }) => (reason ? undefined : 'skip needs --reason "<why it will not run>"'));
