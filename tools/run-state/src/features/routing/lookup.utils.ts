import path from 'node:path';
import type { Pipeline } from '../pipeline/pipeline.types.js';
import type { State } from '../state/state.types.js';
import type { ConditionValue, Lookup, Outcome } from './condition/index.js';
import type { ConditionScopes } from './routing.types.js';

/** run/<id>/my-topic-2026-10-07 → my-topic */
export const slugOf = (runDir: string): string =>
  path.basename(path.resolve(runDir)).replace(/-\d{4}-\d{2}-\d{2}$/, '');

/** The scopes of a run, in lookup order: reported values, params, constants, built-ins. */
export const scopesOf = (pipeline: Pipeline, state: State, runDir: string): ConditionScopes => ({
  vars: state.vars ?? {},
  params: state.context.params,
  constants: state.context.constants,
  builtIns: { id: pipeline.id, date: state.createdAt.slice(0, 10), slug: slugOf(runDir) },
});

/** A name resolves from the first scope that has it: vars, then params, constants, built-ins. */
export const lookupIn =
  (scopes: ConditionScopes): Lookup =>
  (name: string): Outcome<ConditionValue> => {
    const scope: Readonly<Record<string, unknown>> | undefined = [
      scopes.vars,
      scopes.params,
      scopes.constants,
      scopes.builtIns,
    ].find((candidate: Readonly<Record<string, unknown>>): boolean =>
      Object.hasOwn(candidate, name),
    );
    return scope === undefined
      ? {
          ok: false,
          error: `condition uses "${name}", which no step reported and is no param, constant or built-in`,
        }
      : { ok: true, value: scope[name] };
  };
