/**
 * THE COMMAND REGISTRY — every command the recorder takes, in the order --help and --list-guards
 * show them. The CLI builds itself from this list.
 *
 * Add a command:    write `<name>.command.ts` (kind, arguments, options, guards, a pure `apply`),
 *                   import it here and put it in the list.
 * Remove a command: delete its line here, then its file.
 */
import type { AnyCommand } from './commands.types.js';
import { failCommand } from './fail.command.js';
import { finishCommand } from './finish.command.js';
import { humanCommand } from './human.command.js';
import { openCommand } from './open.command.js';
import { readyCommand } from './ready.command.js';
import { showCommand } from './show.command.js';
import { skipCommand } from './skip.command.js';
import { startStepCommand } from './start-step.command.js';
import { startCommand } from './start.command.js';
import { stepDoneCommand } from './step-done.command.js';

export const COMMANDS: readonly AnyCommand[] = [
  openCommand,
  startCommand,
  startStepCommand,
  stepDoneCommand,
  humanCommand,
  failCommand,
  skipCommand,
  readyCommand,
  showCommand,
  finishCommand,
];

export {
  failCommand,
  finishCommand,
  humanCommand,
  openCommand,
  readyCommand,
  showCommand,
  skipCommand,
  startCommand,
  startStepCommand,
  stepDoneCommand,
};
export { execute } from './commands.utils.js';
export type * from './commands.types.js';
