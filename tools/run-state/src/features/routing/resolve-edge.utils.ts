import type { Edge, Pipeline } from '../pipeline/pipeline.types.js';
import { evaluateCondition } from './condition/index.js';
import type { Lookup, Outcome } from './condition/index.js';
import type { RouteFailureReason, RouteResult } from './routing.types.js';

const failure = (reason: RouteFailureReason, error: string): RouteResult => ({
  ok: false,
  reason,
  error,
});

/**
 * Where `event`, returned by `step`, goes:
 *
 * 1. The event must be one of the step's transitions.
 * 2. Its edge has a `condition`? Evaluate it. False → take the step's first edge without a
 *    condition instead (none → no route).
 * 3. The edge taken has a `max` and was taken that many times already (`counts`)? Take its `onMax`
 *    (`capped`; none → the run stops). Otherwise its `target`.
 *
 * Pure: the caller counts the edge (when not capped) and records the decision.
 */
export const resolveEdge =
  (pipeline: Pipeline) =>
  (lookup: Lookup, counts: Readonly<Record<string, number>>) =>
  (step: string, event: string): RouteResult => {
    const transitions: Record<string, Edge> = pipeline.steps[step]?.transitions ?? {};
    const edge: Edge | undefined = Object.hasOwn(transitions, event)
      ? transitions[event]
      : undefined;
    if (edge === undefined) {
      return failure(
        'unknown-event',
        `"${event}" is not an event of "${step}": expected one of ${Object.keys(transitions).join(', ')}`,
      );
    }
    const holds: Outcome<boolean> =
      edge.condition === undefined
        ? { ok: true, value: true }
        : evaluateCondition(lookup)(edge.condition);
    if (!holds.ok) return failure('bad-condition', holds.error);
    const taken: string | undefined = holds.value
      ? event
      : Object.keys(transitions).find(
          (key: string): boolean => transitions[key]?.condition === undefined,
        );
    if (taken === undefined) {
      return failure(
        'no-fallback',
        `the condition "${edge.condition}" on ${step}:${event} is false and "${step}" has no unconditional edge`,
      );
    }
    const chosen: Edge = transitions[taken] as Edge;
    const key = `${step}:${taken}`;
    const count: number = counts[key] ?? 0;
    if (chosen.max === undefined || count < chosen.max) {
      return { ok: true, value: { key, taken, targets: [...chosen.target], capped: false } };
    }
    return chosen.onMax === undefined
      ? failure(
          'cap-spent',
          `edge ${key} was taken ${count} time(s), its max, and has no onMax: the run stops here`,
        )
      : {
          ok: true,
          value: { key, taken, targets: [...chosen.onMax], capped: true, max: chosen.max },
        };
  };
