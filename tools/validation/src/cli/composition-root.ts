import os from 'node:os';
import path from 'node:path';
import { createFileSystemClient } from '../clients/file-system/index.js';
import type { FileSystemClient } from '../clients/file-system/index.js';
import { locatePipelineFactory } from '../features/pipeline/services/index.js';
import { formatJson, formatRules, formatText } from '../features/report/index.js';
import { PIPELINE_RULES, SETUP_RULES } from '../features/rules/index.js';
import { validatePipelineFactory } from '../features/validate/index.js';
import type { ValidationReport } from '../features/validate/index.js';
import { projectRootFrom } from '../shared/config/paths.js';
import { errorMessage } from '../shared/utils/error.utils.js';
import { logger } from '../shared/utils/logger.js';
import { EXIT } from './cli.utils.js';
import type { CliOptions, ExitCode } from './cli.utils.js';

export interface Output {
  out: (text: string) => void;
  err: (text: string) => void;
}

/** Wires the real disk and stdout to the validator; returns the exit code. */
export const runCli =
  (output: Output, fileSystem: FileSystemClient = createFileSystemClient()) =>
  (usage: string) =>
  (idOrPath: string | undefined, options: CliOptions): ExitCode => {
    if (options.listRules) {
      output.out(formatRules(SETUP_RULES, PIPELINE_RULES));
      return EXIT.ok;
    }
    const cwd: string = process.cwd();
    const rootPath: string = path.resolve(options.root ?? projectRootFrom(cwd));
    logger.debug('validate', { idOrPath, rootPath, cwd });

    const file: string | Error = ((): string | Error => {
      try {
        return locatePipelineFactory(fileSystem)(rootPath, cwd)(idOrPath);
      } catch (error: unknown) {
        return new Error(errorMessage(error));
      }
    })();
    if (file instanceof Error) {
      output.err(`error: ${file.message}\n${usage}`);
      return EXIT.usage;
    }

    const report: ValidationReport = validatePipelineFactory(fileSystem)({
      rootPath,
      cwd,
      homePath: os.homedir(),
    })(file);
    output.out(options.json ? formatJson(report) : formatText(report));
    return report.ok ? EXIT.ok : EXIT.invalid;
  };
