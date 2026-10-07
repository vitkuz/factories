import {
  errorGiven,
  runIsRunning,
  stepIsKnown,
  stepIsNamed,
  stepIsRunning,
  runDirGiven,
} from '../guards/index.js';
import type { State, StepRecord } from '../state/state.types.js';
import { record, recordAt, removeActive, setStatus, updateStep } from '../state/state.utils.js';
import { flow } from '../../shared/utils/fp.utils.js';
import { applied, stepNameOf } from './commands.utils.js';
import type { CommandResult, FailOutput, RunCommand, RunContext } from './commands.types.js';

const apply = (context: RunContext): CommandResult<FailOutput> => {
  const { state, clock, input }: RunContext = context;
  const name: string = stepNameOf(context);
  const error: string = input.error ?? '';
  const completedAt: string = clock.now();
  const failed: State = flow<State>(
    updateStep(name, (step: StepRecord): StepRecord => ({
      ...step,
      status: 'FAILED',
      completedAt,
      error,
    })),
    removeActive(name),
    recordAt(completedAt)({
      type: 'STEP_FAIL',
      step: name,
      message: `Step "${name}" failed: ${error}.`,
      details: { error },
    }),
    setStatus('FAILED'),
    record(clock)({
      type: 'PIPELINE_FAIL',
      message: `Pipeline failed at step "${name}".`,
      details: { step: name },
    }),
  )(state);
  return applied({ step: name, status: failed.status }, failed);
};

export const failCommand: RunCommand<FailOutput> = {
  kind: 'run',
  name: 'fail',
  arguments: ['runDir', 'step'],
  options: ['error'],
  usage: '<runDir> <step> --error <text>',
  summary:
    'Records that a running step could not be done: the step and the whole run become FAILED.',
  inputGuards: [runDirGiven, errorGiven],
  guards: [runIsRunning, stepIsNamed, stepIsKnown, stepIsRunning],
  apply,
};
