import path from 'node:path';
import type { Result } from '../../../shared/types/result.types.js';
import { chain, ok, refuse, refusedWith } from '../../../shared/utils/result.utils.js';
import { execute } from '../../commands/commands.utils.js';
import type {
  CommandInput,
  CommandResult,
  RunCommand,
  RunInput,
  ShowCommand,
} from '../../commands/commands.types.js';
import { firstRefusal } from '../../guards/guards.utils.js';
import type { Pipeline } from '../../pipeline/pipeline.types.js';
import {
  PIPELINE_CHECKS,
  loadPipelineFactory,
} from '../../pipeline/services/load-pipeline.service.js';
import { readStateFactory, writeStateFactory } from '../../state/services/index.js';
import type { State } from '../../state/state.types.js';
import type { RecordDeps } from '../record.types.js';

/**
 * The graph a run follows: the run's own pipeline.json snapshot (hooks.before copies it into the
 * run folder) outranks the factory's current file, which state.pipelineFile names.
 */
export const pipelineFileOf =
  (deps: RecordDeps) =>
  (runDir: string, state: State): string | undefined => {
    const snapshot: string = path.join(runDir, 'pipeline.json');
    if (deps.fileSystem.exists(snapshot)) return snapshot;
    return state.pipelineFile === undefined
      ? undefined
      : path.resolve(deps.rootPath, state.pipelineFile);
  };

const loadRunPipeline =
  (deps: RecordDeps) =>
  (runDir: string, state: State): Result<Pipeline> => {
    const file: string | undefined = pipelineFileOf(deps)(runDir, state);
    return file === undefined
      ? refuse(PIPELINE_CHECKS.exists.id)('state.json names no pipelineFile: cannot read the graph')
      : loadPipelineFactory(deps.fileSystem)(file);
  };

/** Write the new state when the command made one; hand back what to print. */
const commit =
  (deps: RecordDeps, runDir: string) =>
  <Output>(result: CommandResult<Output>): Result<Output> => {
    if (!result.ok) return result;
    if (result.value.state !== undefined) {
      writeStateFactory(deps.fileSystem)(runDir, result.value.state);
    }
    return ok(result.value.output);
  };

/**
 * Every command but open: argument guards → read state.json → load the graph (not for show) → the
 * command's guards and body (pure) → write state.json atomically. A refusal anywhere writes nothing.
 */
export const runCommandFactory =
  (deps: RecordDeps) =>
  (command: RunCommand | ShowCommand) =>
  (raw: CommandInput): Result<unknown> => {
    const argumentRefusal = firstRefusal(command.inputGuards)(raw);
    if (argumentRefusal !== undefined) return refusedWith(argumentRefusal);
    const input: RunInput = { ...raw, runDir: path.resolve(deps.cwd, raw.runDir ?? '') };
    const save = commit(deps, input.runDir);

    return chain((state: State): Result<unknown> => {
      if (command.kind === 'show') return save(execute(command)({ state }));
      return chain((pipeline: Pipeline): Result<unknown> =>
        save(execute(command)({ state, pipeline, input, clock: deps.clockAfter(state.updatedAt) })),
      )(loadRunPipeline(deps)(input.runDir, state));
    })(readStateFactory(deps.fileSystem)(input.runDir));
  };
