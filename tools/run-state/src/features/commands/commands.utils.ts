import path from 'node:path';
import type { Scalar } from '../pipeline/pipeline.types.js';
import { lookupIn, resolveEdge, scopesOf } from '../routing/index.js';
import type { RouteResult } from '../routing/index.js';
import type { State, StepRecord } from '../state/state.types.js';
import { ok } from '../../shared/utils/result.utils.js';
import type { Guard } from '../guards/guards.types.js';
import { firstRefusal } from '../guards/guards.utils.js';
import type { Applied, CommandResult, RunContext } from './commands.types.js';

/**
 * Run a command: its guards in order, then its body. The first refusal comes back instead of a
 * state, and nothing else happens. Pure, given a pure clock.
 */
export const execute =
  <Context, Output>(command: {
    guards: readonly Guard<Context>[];
    apply: (context: Context) => CommandResult<Output>;
  }) =>
  (context: Context): CommandResult<Output> => {
    const refusal = firstRefusal(command.guards)(context);
    return refusal === undefined ? command.apply(context) : { ok: false, refusal };
  };

export const applied = <Output>(output: Output, state?: State): CommandResult<Output> =>
  ok<Applied<Output>>(state === undefined ? { output } : { state, output });

// --- arguments -------------------------------------------------------------------------------

/** The name=value pairs that are malformed (no "=", or nothing before it). */
export const malformedPairs = (pairs: readonly string[]): string[] =>
  pairs.filter((pair: string): boolean => pair.indexOf('=') < 1);

/** name=value pairs as a record; a name given twice keeps its last value. Malformed pairs are left out. */
export const pairsOf = (pairs: readonly string[]): Record<string, string> =>
  Object.fromEntries(
    pairs
      .filter((pair: string): boolean => pair.indexOf('=') >= 1)
      .map((pair: string): [string, string] => [
        pair.slice(0, pair.indexOf('=')),
        pair.slice(pair.indexOf('=') + 1),
      ]),
  );

/** A reported value: true/false become booleans, a plain number a number, anything else stays text. */
export const parseReported = (raw: string): Scalar => {
  if (raw === 'true' || raw === 'false') return raw === 'true';
  return /^-?\d+(\.\d+)?$/.test(raw) ? Number(raw) : raw;
};

/** --report pairs, typed. */
export const reportedOf = (reports: readonly string[]): Record<string, Scalar> =>
  Object.fromEntries(
    Object.entries(pairsOf(reports)).map(([name, raw]: [string, string]): [string, Scalar] => [
      name,
      parseReported(raw),
    ]),
  );

/**
 * An output is stored relative to the run folder (`3-write/report.md`), the way the dashboard reads
 * it; an absolute path is cut down to its path from the run folder.
 */
export const outputsFor =
  (runDir: string) =>
  (files: readonly string[]): string[] =>
    files.map((file: string): string =>
      path.isAbsolute(file) ? path.relative(runDir, file).split('\\').join('/') : file,
    );

// --- the step a command names ----------------------------------------------------------------

/** The step the command names. Guards before step-is-named make sure there is one. */
export const stepNameOf = (context: RunContext): string => context.input.step ?? '';

export const stepRecordOf = (context: RunContext): StepRecord | undefined =>
  context.state.steps[stepNameOf(context)];

export const isHumanStep = (context: RunContext): boolean =>
  context.pipeline.steps[stepNameOf(context)]?.agent === 'human';

// --- routing a returned event ----------------------------------------------------------------

/** The state with this call's --report values merged over the run's vars. */
export const withReported = (context: RunContext): State => ({
  ...context.state,
  vars: { ...(context.state.vars ?? {}), ...reportedOf(context.input.reports) },
});

/** Where the event this call reports goes, judged on the state with its --report values merged in. */
export const routeOf = (context: RunContext): RouteResult => {
  const state: State = withReported(context);
  return resolveEdge(context.pipeline)(
    lookupIn(scopesOf(context.pipeline, state, context.input.runDir)),
    state.edges ?? {},
  )(stepNameOf(context), context.input.event ?? '');
};
