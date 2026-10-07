import { runIsIdle, runDirGiven } from '../guards/index.js';
import { readinessOf } from '../routing/index.js';
import type { State } from '../state/state.types.js';
import { record, setFrontier, setStatus } from '../state/state.utils.js';
import { flow } from '../../shared/utils/fp.utils.js';
import { applied } from './commands.utils.js';
import type { CommandResult, RunCommand, RunContext, StartOutput } from './commands.types.js';

const apply = ({ state, pipeline, clock }: RunContext): CommandResult<StartOutput> => {
  const started: State = flow<State>(
    setStatus('RUNNING'),
    setFrontier(pipeline.START),
    record(clock)({
      type: 'WAVE_START',
      message: `Pipeline started at wave ${state.currentWave}.`,
    }),
  )(state);
  return applied({ status: started.status, ready: readinessOf(pipeline)(started).ready }, started);
};

export const startCommand: RunCommand<StartOutput> = {
  kind: 'run',
  name: 'start',
  arguments: ['runDir'],
  options: [],
  usage: '<runDir>',
  summary: 'Starts the run: RUNNING, and the START steps are routed to.',
  inputGuards: [runDirGiven],
  guards: [runIsIdle],
  apply,
};
