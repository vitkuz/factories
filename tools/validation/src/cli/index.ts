import { Command, CommanderError } from 'commander';
import { EXIT } from './cli.utils.js';
import type { CliOptions } from './cli.utils.js';
import { runCli } from './composition-root.js';

const program: Command = new Command()
  .name('factory-validate')
  .description(
    'Validate a factory pipeline.json before a run: the Zod shape, then the graph rules (--list-rules).',
  )
  .argument(
    '[pipeline]',
    'an id under <root>/factories.local/ or <root>/factories/, or a path to a pipeline.json',
  )
  .option(
    '--root <dir>',
    'what {{rootPath}} resolves to (default: the nearest folder above the working directory holding .claude/)',
  )
  .option('--json', 'print {"ok", "pipeline", "errors", "warnings", "rulesRan", "findings"}', false)
  .option('--list-rules', 'print every rule the validator runs, and exit', false)
  .exitOverride()
  .configureOutput({ writeErr: (text: string): boolean => process.stderr.write(text) });

const main = (): number => {
  try {
    program.parse(process.argv);
  } catch (error: unknown) {
    if (error instanceof CommanderError) {
      return error.exitCode === 0 ? EXIT.ok : EXIT.usage;
    }
    throw error;
  }
  return runCli({
    out: (text: string): void => console.log(text),
    err: (text: string): void => console.error(text),
  })(program.helpInformation().trimEnd())(program.args[0], program.opts<CliOptions>());
};

process.exitCode = main();
