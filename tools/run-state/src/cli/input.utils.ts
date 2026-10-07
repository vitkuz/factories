import type { AnyCommand, ArgumentName, CommandInput } from '../features/commands/index.js';
import type { ParsedOptions } from './cli.utils.js';

/**
 * The command line → a CommandInput. `open <runDir> --pipeline <file>` is accepted too, and the
 * event may come positionally, as --event or as --answer.
 */
export const inputOf =
  (command: AnyCommand) =>
  (positional: readonly (string | undefined)[], options: ParsedOptions): CommandInput => {
    const named: Partial<Record<ArgumentName, string>> = Object.fromEntries(
      command.arguments.map(
        (name: ArgumentName, index: number): [ArgumentName, string | undefined] => [
          name,
          positional[index],
        ],
      ),
    );
    const pipelineFlag: boolean = options.pipeline !== undefined;
    return {
      command: command.name,
      runDir: pipelineFlag ? named.pipeline : named.runDir,
      pipelineRef: pipelineFlag ? options.pipeline : named.pipeline,
      step: named.step,
      event: named.event ?? options.event ?? options.answer,
      outputs: options.output ?? [],
      reports: options.report ?? [],
      params: options.param ?? [],
      note: options.note,
      error: options.error,
      reason: options.reason,
    };
  };
