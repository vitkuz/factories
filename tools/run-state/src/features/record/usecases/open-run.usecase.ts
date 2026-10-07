import path from 'node:path';
import type { Result } from '../../../shared/types/result.types.js';
import { errorMessage } from '../../../shared/utils/error.utils.js';
import { repoRelative } from '../../../shared/utils/path.utils.js';
import { chain, ok, refuse, refusedWith } from '../../../shared/utils/result.utils.js';
import { execute } from '../../commands/commands.utils.js';
import type {
  CommandInput,
  CommandResult,
  OpenCommand,
  OpenOutput,
  RunInput,
} from '../../commands/commands.types.js';
import { firstRefusal } from '../../guards/guards.utils.js';
import type { Pipeline } from '../../pipeline/pipeline.types.js';
import { loadPipelineFactory, locatePipelineFactory } from '../../pipeline/services/index.js';
import { writeStateFactory } from '../../state/services/index.js';
import { statePathFor } from '../../state/state.utils.js';
import type { RecordDeps } from '../record.types.js';
import { OPEN_CHECKS } from '../record.utils.js';

/**
 * open: argument guards → no state.json yet → find and load the pipeline → open's guards and body
 * (pure) → create the run folder and write state.json. A refusal anywhere writes nothing.
 */
export const openRunFactory =
  (deps: RecordDeps) =>
  (command: OpenCommand) =>
  (raw: CommandInput): Result<OpenOutput> => {
    const argumentRefusal = firstRefusal(command.inputGuards)(raw);
    if (argumentRefusal !== undefined) return refusedWith(argumentRefusal);
    const input: RunInput = { ...raw, runDir: path.resolve(deps.cwd, raw.runDir ?? '') };
    const stateFile: string = statePathFor(input.runDir);
    if (deps.fileSystem.exists(stateFile)) {
      return refuse(OPEN_CHECKS.notOpen.id)(`${stateFile} already exists: this run is open`);
    }

    const located: Result<string> = ((): Result<string> => {
      try {
        return ok(
          locatePipelineFactory(deps.fileSystem)(deps.rootPath, deps.cwd)(input.pipelineRef),
        );
      } catch (error: unknown) {
        return refuse(OPEN_CHECKS.found.id)(errorMessage(error));
      }
    })();

    return chain((file: string): Result<OpenOutput> =>
      chain((pipeline: Pipeline): Result<OpenOutput> => {
        const result: CommandResult<OpenOutput> = execute(command)({
          pipeline,
          input,
          clock: deps.clockAfter(),
          newRunId: deps.newRunId,
          pipelineFile: repoRelative(deps.rootPath)(file),
          schemaRef: repoRelative(deps.rootPath)(deps.schemaFile),
          sessionId: deps.sessionId,
          stateFile,
        });
        if (!result.ok) return result;
        if (result.value.state !== undefined) {
          deps.fileSystem.makeDirectory(input.runDir);
          writeStateFactory(deps.fileSystem)(input.runDir, result.value.state);
        }
        return ok(result.value.output);
      })(loadPipelineFactory(deps.fileSystem)(file)),
    )(located);
  };
