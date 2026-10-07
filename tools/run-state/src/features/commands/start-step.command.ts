import {
  fanInReady,
  runIsRunning,
  stepIsKnown,
  stepIsNamed,
  stepIsRouted,
  stepNotRunning,
  runDirGiven,
} from '../guards/index.js';
import type { State, StepRecord } from '../state/state.types.js';
import {
  addActive,
  recordAt,
  removeFromFrontier,
  updateStep,
  withoutKeys,
} from '../state/state.utils.js';
import { flow } from '../../shared/utils/fp.utils.js';
import { applied, stepNameOf, stepRecordOf } from './commands.utils.js';
import type { CommandResult, RunCommand, RunContext, StartStepOutput } from './commands.types.js';

/** What a pass leaves behind; a new pass starts without it. */
const PASS_FIELDS: readonly (keyof StepRecord)[] = [
  'completedAt',
  'outputs',
  'event',
  'reported',
  'note',
  'error',
  'skipReason',
];

const apply = (context: RunContext): CommandResult<StartStepOutput> => {
  const { state, clock }: RunContext = context;
  const name: string = stepNameOf(context);
  const step: StepRecord | undefined = stepRecordOf(context);
  const pass: number = (step?.passes ?? 0) + 1;
  const startedAt: string = clock.now();
  const started: State = flow<State>(
    updateStep(name, (record: StepRecord): StepRecord => ({
      ...withoutKeys(PASS_FIELDS)(record),
      status: 'RUNNING',
      startedAt,
      passes: pass,
    })),
    addActive(name),
    removeFromFrontier(name),
    (current: State): State => ({
      ...current,
      currentWave: Math.max(current.currentWave, step?.order || 1),
    }),
    recordAt(startedAt)({
      type: 'STEP_START',
      step: name,
      message: `Step '${name}' started.`,
      ...(pass > 1 ? { details: { pass } } : {}),
    }),
  )(state);
  return applied({ step: name, pass }, started);
};

export const startStepCommand: RunCommand<StartStepOutput> = {
  kind: 'run',
  name: 'start-step',
  arguments: ['runDir', 'step'],
  options: [],
  usage: '<runDir> <step>',
  summary:
    'Records that a step starts (one more pass): before you spawn its subagent or ask its human.',
  inputGuards: [runDirGiven],
  guards: [runIsRunning, stepIsNamed, stepIsKnown, stepNotRunning, stepIsRouted, fanInReady],
  apply,
};
