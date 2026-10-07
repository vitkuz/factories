import type { CommandInput } from '../commands/commands.types.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const runDirGiven: Guard<CommandInput> = defineGuard<CommandInput>({
  id: 'run-dir-given',
  description: 'The command names the run folder (open: and the pipeline before it).',
})(({ command, runDir }) => {
  if (runDir !== undefined) return undefined;
  return command === 'open'
    ? 'open needs <id | pipeline.json> <runDir>'
    : `name the run folder: ${command} <runDir> …`;
});
