import type { OpenContext } from '../commands/commands.types.js';
import { malformedPairs } from '../commands/commands.utils.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const paramsArePairs: Guard<OpenContext> = defineGuard<OpenContext>({
  id: 'params-are-pairs',
  description: 'Every --param is name=value.',
})(({ input }) => {
  const [first]: string[] = malformedPairs(input.params);
  return first === undefined ? undefined : `--param takes name=value, got "${first}"`;
});
