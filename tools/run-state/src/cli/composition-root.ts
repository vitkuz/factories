import path from 'node:path';
import { createRunIdGenerator, createSystemClock } from '../clients/clock/index.js';
import { createFileSystemClient } from '../clients/file-system/index.js';
import type { AnyCommand, CommandInput } from '../features/commands/index.js';
import { openRunFactory, runCommandFactory } from '../features/record/index.js';
import type { RecordDeps } from '../features/record/index.js';
import { formatOutput } from '../features/report/index.js';
import type { Result } from '../shared/types/result.types.js';
import env from '../shared/config/env.js';
import { projectRootFrom } from '../shared/config/paths.js';
import { logger } from '../shared/utils/logger.js';
import { EXIT } from './cli.utils.js';
import type { ExitCode, Output } from './cli.utils.js';

/** The real disk, the wall clock, random run ids, the project the command runs in. */
export const createDeps = (): RecordDeps => {
  const cwd: string = process.cwd();
  const rootPath: string = projectRootFrom(cwd);
  return {
    fileSystem: createFileSystemClient(),
    clockAfter: createSystemClock,
    newRunId: createRunIdGenerator(),
    rootPath,
    cwd,
    sessionId: env.CLAUDE_SESSION_ID,
    schemaFile: path.join(rootPath, 'factories', 'state.schema.json'),
  };
};

/** Run one command against the deps; print its JSON or its refusal; return the exit code. */
export const runCli =
  (output: Output, deps: RecordDeps = createDeps()) =>
  (command: AnyCommand) =>
  (input: CommandInput): ExitCode => {
    logger.debug('command', { command: command.name, input });
    try {
      const result: Result<unknown> =
        command.kind === 'open'
          ? openRunFactory(deps)(command)(input)
          : runCommandFactory(deps)(command)(input);
      if (!result.ok) {
        logger.debug('refused', { guard: result.refusal.guard });
        output.err(`refused: ${result.refusal.message}`);
        return EXIT.refused;
      }
      output.out(formatOutput(result.value));
      return EXIT.ok;
    } catch (error: unknown) {
      output.err(
        `error: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
      );
      return EXIT.error;
    }
  };
