import type { Clock } from '../../clients/clock/index.js';
import { allNeighbours, reachableVia } from '../pipeline/graph.utils.js';
import type { Pipeline } from '../pipeline/pipeline.types.js';
import type { State, StepRecord, Transition } from '../state/state.types.js';
import { liveOf, skipStep, stepEntriesOf } from '../state/state.utils.js';
import { flow } from '../../shared/utils/fp.utils.js';

/** Never-started steps that nothing live (running or routed) can reach any more, by any edge. */
export const strandedSteps =
  (pipeline: Pipeline) =>
  (state: State): string[] => {
    const reachable: Set<string> = reachableVia(allNeighbours)(pipeline)(liveOf(state));
    return stepEntriesOf(state)
      .filter(
        ([name, step]: [string, StepRecord]): boolean =>
          step.status === 'PENDING' && !step.passes && !reachable.has(name),
      )
      .map(([name]: [string, StepRecord]): string => name);
  };

/** Close every stranded step as SKIPPED, `because` the route that stranded it. */
export const skipStranded =
  (pipeline: Pipeline, clock: Clock) =>
  (because: string): Transition =>
  (state: State): State =>
    flow<State>(
      ...strandedSteps(pipeline)(state).map((name: string): Transition =>
        skipStep(clock)(name, `${because} and nothing routes here any more`, true),
      ),
    )(state);
