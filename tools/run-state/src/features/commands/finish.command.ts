import {
  nothingRoutedOnFinish,
  nothingRunningOnFinish,
  runIsRunning,
  runDirGiven,
} from '../guards/index.js';
import type { State, Transition } from '../state/state.types.js';
import { record, setStatus, skipStep, stepNamesWith } from '../state/state.utils.js';
import { flow } from '../../shared/utils/fp.utils.js';
import { applied } from './commands.utils.js';
import type { CommandResult, FinishOutput, RunCommand, RunContext } from './commands.types.js';

const apply = ({ state, pipeline, clock }: RunContext): CommandResult<FinishOutput> => {
  const finished: State = flow<State>(
    ...stepNamesWith('PENDING')(state).map((name: string): Transition =>
      skipStep(clock)(name, 'the run finished and nothing routes here any more', true),
    ),
    setStatus('COMPLETED'),
    record(clock)({
      type: 'PIPELINE_COMPLETE',
      message: 'Every branch reached END and no step is running.',
    }),
  )(state);
  return applied({ status: finished.status, pipeline: pipeline.id }, finished);
};

export const finishCommand: RunCommand<FinishOutput> = {
  kind: 'run',
  name: 'finish',
  arguments: ['runDir'],
  options: [],
  usage: '<runDir>',
  summary: 'Completes the run: every step never reached becomes SKIPPED, the run COMPLETED.',
  inputGuards: [runDirGiven],
  guards: [runIsRunning, nothingRunningOnFinish, nothingRoutedOnFinish],
  apply,
};
