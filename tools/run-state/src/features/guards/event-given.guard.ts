import type { CommandInput } from '../commands/commands.types.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const eventGiven: Guard<CommandInput> = defineGuard<CommandInput>({
  id: 'event-given',
  description: 'The command names the event (positional, --event or --answer).',
})(({ command, event }) => (event ? undefined : `${command} needs <step> <EVENT>`));
