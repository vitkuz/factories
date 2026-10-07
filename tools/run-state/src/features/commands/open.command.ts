import { layersOf } from '../pipeline/graph.utils.js';
import type { Scalar, Step } from '../pipeline/pipeline.types.js';
import {
  paramFitsType,
  paramHasValue,
  paramKnown,
  paramsArePairs,
  runDirGiven,
} from '../guards/index.js';
import type { State, StepRecord } from '../state/state.types.js';
import { recordAt } from '../state/state.utils.js';
import { applied } from './commands.utils.js';
import type { CommandResult, OpenCommand, OpenContext, OpenOutput } from './commands.types.js';
import { paramsOf } from './params.utils.js';

/** A fresh record per step: PENDING, its breadth-first layer from START (0 when unreachable). */
const freshSteps = (context: OpenContext): Record<string, StepRecord> => {
  const layers: Record<string, number> = layersOf(context.pipeline);
  return Object.fromEntries(
    Object.entries(context.pipeline.steps).map(
      ([name, step]: [string, Step]): [string, StepRecord] => [
        name,
        {
          order: layers[name] ?? 0,
          kind: 'agent',
          agent: step.agent,
          status: 'PENDING',
          retryCount: 0,
        },
      ],
    ),
  );
};

const apply = (context: OpenContext): CommandResult<OpenOutput> => {
  const { pipeline, input, clock, newRunId }: OpenContext = context;
  const createdAt: string = clock.now();
  const runId: string = newRunId(createdAt);
  const params: Record<string, Scalar> = paramsOf(pipeline, input.params);
  const opened: State = {
    $schema: context.schemaRef,
    runId,
    pipelineName: pipeline.id,
    pipelineFile: context.pipelineFile,
    status: 'IDLE',
    createdAt,
    updatedAt: createdAt,
    currentWave: 1,
    activeSteps: [],
    context: {
      constants: Object.fromEntries(
        Object.entries(pipeline.constants).map(
          ([name, value]: [string, Scalar]): [string, string] => [name, String(value)],
        ),
      ),
      params,
      captured: {},
    },
    steps: freshSteps(context),
    history: [],
    mode: 'graph',
    edges: {},
  };
  const state: State = recordAt(createdAt)({
    type: 'PIPELINE_INIT',
    message: `Pipeline '${pipeline.id}' initialized with runId '${runId}'.`,
    details: {
      fromStep: '',
      runId,
      sessionId: context.sessionId,
      sessionSource: '',
      start: pipeline.START,
      transcriptPath: '',
    },
  })(opened);
  return applied(
    {
      runId,
      pipeline: pipeline.id,
      pipelineFile: context.pipelineFile,
      stateFile: context.stateFile,
      params,
      start: [...pipeline.START],
    },
    state,
  );
};

export const openCommand: OpenCommand = {
  kind: 'open',
  name: 'open',
  arguments: ['pipeline', 'runDir'],
  options: ['param', 'pipeline'],
  usage: '<id | pipeline.json> <runDir> [--param name=value ...]',
  summary:
    'Creates <runDir>/state.json for a new run (IDLE): params from pipeline.json, overridden by --param.',
  inputGuards: [runDirGiven],
  guards: [paramsArePairs, paramKnown, paramFitsType, paramHasValue],
  apply,
};
