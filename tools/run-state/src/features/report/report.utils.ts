import type { AnyCommand } from '../commands/commands.types.js';
import type { GuardMeta } from '../guards/guards.types.js';
import { loadChecksOf } from '../record/record.utils.js';

const rows = (label: string, checks: readonly GuardMeta[], width: number): string[] =>
  checks.map(
    (check: GuardMeta, index: number): string =>
      `  ${(index === 0 ? label : '').padEnd(10)}${check.id.padEnd(width)}  ${check.description}`,
  );

/**
 * --list-guards: every command, then everything that can make it refuse, in the order it is checked.
 *
 *   step-done <runDir> <step> <EVENT> …
 *     Records the event …
 *     arguments event-given        The command names the event …
 *     loading   state-file-exists  …
 *     guards    run-is-running     …
 */
export const formatGuards = (commands: readonly AnyCommand[]): string => {
  const all: GuardMeta[] = commands.flatMap((command: AnyCommand): GuardMeta[] => [
    ...command.inputGuards,
    ...loadChecksOf(command.kind),
    ...command.guards,
  ]);
  const width: number = Math.max(...all.map((check: GuardMeta): number => check.id.length));
  return commands
    .map((command: AnyCommand): string =>
      [
        `${command.name} ${command.usage}`,
        `  ${command.summary}`,
        ...rows('arguments', command.inputGuards, width),
        ...rows('loading', loadChecksOf(command.kind), width),
        ...rows('guards', command.guards, width),
      ].join('\n'),
    )
    .join('\n\n');
};

/** What a command prints on stdout: its output as two-space JSON. */
export const formatOutput = (output: unknown): string => JSON.stringify(output, null, 2);
