import type { RunContext } from '../commands/commands.types.js';
import { malformedPairs } from '../commands/commands.utils.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const reportsArePairs: Guard<RunContext> = defineGuard<RunContext>({
  id: 'reports-are-pairs',
  description: 'Every --report is name=value.',
})(({ input }) => {
  const [first]: string[] = malformedPairs(input.reports);
  return first === undefined ? undefined : `--report takes name=value, got "${first}"`;
});
