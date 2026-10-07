import { CommanderError } from 'commander';
import type { Command } from 'commander';
import { COMMANDS } from '../features/commands/index.js';
import type { AnyCommand } from '../features/commands/index.js';
import { formatGuards } from '../features/report/index.js';
import { EXIT } from './cli.utils.js';
import type { ExitCode, Output, ParsedOptions } from './cli.utils.js';
import { runCli } from './composition-root.js';
import { inputOf } from './input.utils.js';
import { buildProgram } from './program.js';

const output: Output = {
  out: (text: string): void => console.log(text),
  err: (text: string): void => console.error(text),
};

const main = (): number => {
  const exits: ExitCode[] = [];
  const program: Command = buildProgram(
    COMMANDS,
    (
      command: AnyCommand,
      positional: readonly (string | undefined)[],
      options: ParsedOptions,
    ): void => {
      exits.push(runCli(output)(command)(inputOf(command)(positional, options)));
    },
    (): void => {
      output.out(formatGuards(COMMANDS));
    },
  );
  try {
    program.parse(process.argv);
  } catch (error: unknown) {
    if (error instanceof CommanderError) {
      return error.exitCode === 0 ? EXIT.ok : EXIT.refused;
    }
    throw error;
  }
  return exits[0] ?? EXIT.ok;
};

process.exitCode = main();
