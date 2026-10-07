import type { Refusal } from '../../shared/types/result.types.js';
import type { Guard, GuardMeta } from './guards.types.js';

/**
 * The one way to write a guard:
 *
 *   export const runIsRunning: Guard<RunContext> = defineGuard<RunContext>({
 *     id: 'run-is-running',
 *     description: 'The run is RUNNING.',
 *   })(({ state }) => (state.status === 'RUNNING' ? undefined : `the run is ${state.status}, not RUNNING`));
 *
 * The check returns undefined to let the command go ahead, or the refusal message; the guard stamps
 * its id on it.
 */
export const defineGuard =
  <Context>(meta: GuardMeta) =>
  (check: (context: Context) => string | undefined): Guard<Context> => ({
    ...meta,
    check: (context: Context): Refusal | undefined => {
      const message: string | undefined = check(context);
      return message === undefined ? undefined : { guard: meta.id, message };
    },
  });

/** Run the guards in order; the first refusal, or undefined when every one lets the command go. */
export const firstRefusal =
  <Context>(guards: readonly Guard<Context>[]) =>
  (context: Context): Refusal | undefined =>
    guards.reduce(
      (found: Refusal | undefined, guard: Guard<Context>): Refusal | undefined =>
        found ?? guard.check(context),
      undefined,
    );
