import { forwardNeighbours, reachableVia } from '../pipeline/graph.utils.js';
import type { Pipeline } from '../pipeline/pipeline.types.js';
import type { State } from '../state/state.types.js';
import { activeOf, frontierOf, liveOf } from '../state/state.utils.js';
import type { Readiness } from './routing.types.js';

/**
 * A routed step is ready when no other live step (running or routed) can still reach it by forward
 * edges: a fan-in waits for every branch, and a retry loop (an edge with max) does not count as one.
 */
export const readinessOf =
  (pipeline: Pipeline) =>
  (state: State): Readiness => {
    const running: string[] = activeOf(state);
    const live: string[] = liveOf(state);
    const reaches = (from: string, to: string): boolean =>
      reachableVia(forwardNeighbours)(pipeline)([from], to).has(to);
    const waitingOn: [string, string[]][] = frontierOf(state)
      .filter((name: string): boolean => !running.includes(name))
      .map((name: string): [string, string[]] => [
        name,
        live.filter((other: string): boolean => other !== name && reaches(other, name)),
      ]);
    return {
      ready: waitingOn
        .filter(([, others]: [string, string[]]): boolean => others.length === 0)
        .map(([name]: [string, string[]]): string => name),
      running,
      waiting: Object.fromEntries(
        waitingOn.filter(([, others]: [string, string[]]): boolean => others.length > 0),
      ),
    };
  };
