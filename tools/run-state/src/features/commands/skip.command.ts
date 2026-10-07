import {
  reasonGiven,
  runIsRunning,
  stepIsKnown,
  stepIsNamed,
  stepIsPending,
  runDirGiven,
} from '../guards/index.js';
import { readinessOf, skipStranded } from '../routing/index.js';
import type { State } from '../state/state.types.js';
import { removeFromFrontier, skipStep } from '../state/state.utils.js';
import { flow } from '../../shared/utils/fp.utils.js';
import { applied, stepNameOf } from './commands.utils.js';
import type { CommandResult, RunCommand, RunContext, SkipOutput } from './commands.types.js';

const apply = (context: RunContext): CommandResult<SkipOutput> => {
  const { state, pipeline, clock, input }: RunContext = context;
  const name: string = stepNameOf(context);
  const skipped: State = flow<State>(
    skipStep(clock)(name, input.reason ?? '', false),
    removeFromFrontier(name),
    skipStranded(pipeline, clock)(`${name} was skipped`),
  )(state);
  return applied({ step: name, ...readinessOf(pipeline)(skipped) }, skipped);
};

export const skipCommand: RunCommand<SkipOutput> = {
  kind: 'run',
  name: 'skip',
  arguments: ['runDir', 'step'],
  options: ['reason'],
  usage: '<runDir> <step> --reason <text>',
  summary: 'Records that a step will not run, then closes every step only it led to.',
  inputGuards: [runDirGiven, reasonGiven],
  guards: [runIsRunning, stepIsNamed, stepIsKnown, stepIsPending],
  apply,
};
