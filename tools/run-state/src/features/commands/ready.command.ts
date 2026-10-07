import { runDirGiven } from '../guards/index.js';
import { readinessOf } from '../routing/index.js';
import { applied } from './commands.utils.js';
import type { CommandResult, ReadyOutput, RunCommand, RunContext } from './commands.types.js';

const apply = ({ state, pipeline }: RunContext): CommandResult<ReadyOutput> =>
  applied({
    status: state.status,
    ...readinessOf(pipeline)(state),
    done: state.status === 'COMPLETED' || state.status === 'FAILED',
  });

export const readyCommand: RunCommand<ReadyOutput> = {
  kind: 'run',
  name: 'ready',
  arguments: ['runDir'],
  options: [],
  usage: '<runDir>',
  summary: 'Prints what may start now, what runs, and what waits (fan-in). Writes nothing.',
  inputGuards: [runDirGiven],
  guards: [],
  apply,
};
