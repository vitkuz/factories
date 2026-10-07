import type { RunContext } from '../commands/commands.types.js';
import { stepNameOf } from '../commands/commands.utils.js';
import type { Guard } from './guards.types.js';
import { defineGuard } from './guards.utils.js';

export const stepIsKnown: Guard<RunContext> = defineGuard<RunContext>({
  id: 'step-is-known',
  description: 'The step is in the pipeline and in the run state.',
})((context) => {
  const { pipeline, state }: RunContext = context;
  const name: string = stepNameOf(context);
  return Object.hasOwn(pipeline.steps, name) && Object.hasOwn(state.steps, name)
    ? undefined
    : `"${name}" is not a step of ${pipeline.id}: expected one of ${Object.keys(pipeline.steps).join(', ')}`;
});
