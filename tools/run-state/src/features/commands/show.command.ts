import { runDirGiven } from '../guards/index.js';
import type { State } from '../state/state.types.js';
import { normalizeState } from '../state/state.utils.js';
import { applied } from './commands.utils.js';
import type { CommandResult, ShowCommand, ShowContext } from './commands.types.js';

const apply = ({ state }: ShowContext): CommandResult<State> => applied(normalizeState(state));

export const showCommand: ShowCommand = {
  kind: 'show',
  name: 'show',
  arguments: ['runDir'],
  options: [],
  usage: '<runDir>',
  summary: 'Prints state.json in its written form. Needs no pipeline. Writes nothing.',
  inputGuards: [runDirGiven],
  guards: [],
  apply,
};
