import { Command } from 'commander';
import type { AnyCommand, ArgumentName, OptionName } from '../features/commands/index.js';
import type { ParsedOptions } from './cli.utils.js';

const ARGUMENTS: Readonly<Record<ArgumentName, string>> = {
  pipeline: 'an id under factories.local/ or factories/, or a path to a pipeline.json',
  runDir: 'the run folder (state.json lives there)',
  step: 'a step of the pipeline',
  event: 'the event the step returned (or --event / --answer)',
};

const collect = (value: string, previous: string[]): string[] => [...previous, value];

interface OptionSpec {
  flags: string;
  description: string;
  repeatable?: boolean;
}

const OPTIONS: Readonly<Record<OptionName, OptionSpec>> = {
  param: {
    flags: '--param <name=value>',
    description: 'set a pipeline param (repeat)',
    repeatable: true,
  },
  pipeline: {
    flags: '--pipeline <file>',
    description: 'the pipeline, when the only argument is <runDir>',
  },
  event: { flags: '--event <EVENT>', description: 'the event, instead of the positional one' },
  answer: {
    flags: '--answer <EVENT>',
    description: 'the answer (event), instead of the positional one',
  },
  output: {
    flags: '--output <file>',
    description: 'a file the step wrote (repeat)',
    repeatable: true,
  },
  report: {
    flags: '--report <name=value>',
    description: 'a value the step reported (repeat)',
    repeatable: true,
  },
  note: { flags: '--note <text>', description: 'a note kept with the pass' },
  error: { flags: '--error <text>', description: 'what went wrong' },
  reason: { flags: '--reason <text>', description: 'why the step will not run' },
};

export type OnCommand = (
  command: AnyCommand,
  positional: readonly (string | undefined)[],
  options: ParsedOptions,
) => void;

/** One commander subcommand per registered command; every positional is optional to the parser. */
const subcommandFor =
  (onCommand: OnCommand) =>
  (command: AnyCommand): Command => {
    const withArguments: Command = command.arguments.reduce(
      (sub: Command, name: ArgumentName): Command => sub.argument(`[${name}]`, ARGUMENTS[name]),
      new Command(command.name).description(command.summary).usage(command.usage),
    );
    return command.options
      .reduce((sub: Command, name: OptionName): Command => {
        const spec: OptionSpec = OPTIONS[name];
        return spec.repeatable === true
          ? sub.option(spec.flags, spec.description, collect, [])
          : sub.option(spec.flags, spec.description);
      }, withArguments)
      .allowExcessArguments(true)
      .action((...values: unknown[]): void => {
        const self: Command = values[values.length - 1] as Command;
        onCommand(
          command,
          self.processedArgs as (string | undefined)[],
          self.opts<ParsedOptions>(),
        );
      });
  };

export const buildProgram = (
  commands: readonly AnyCommand[],
  onCommand: OnCommand,
  onListGuards: () => void,
): Command => {
  const program: Command = new Command()
    .name('state')
    .description(
      'Records one factory run in <runDir>/state.json. Prints JSON; a refusal prints "refused: …" on stderr, exits 2 and writes nothing.',
    )
    .option('--list-guards', 'print every command and what makes it refuse, in order, and exit')
    .exitOverride()
    .configureOutput({ writeErr: (text: string): boolean => process.stderr.write(text) });
  commands.map(subcommandFor(onCommand)).forEach((sub: Command): void => {
    program.addCommand(sub.exitOverride());
  });
  return program.allowExcessArguments(true).action((): void => {
    const [unknown]: string[] = program.args;
    if (unknown !== undefined) {
      program.error(`error: unknown command "${unknown}" (see --help)`, { exitCode: 2 });
    }
    if (program.opts<{ listGuards?: boolean }>().listGuards === true) onListGuards();
    else program.outputHelp();
  });
};
