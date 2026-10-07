import { END } from '../pipeline/pipeline.utils.js';
import { readinessOf, skipStranded } from '../routing/index.js';
import type { EdgeDecision, Readiness, RouteResult } from '../routing/index.js';
import type { HistoryDraft, State, StepRecord, Transition } from '../state/state.types.js';
import {
  addToFrontier,
  liveOf,
  record,
  recordAt,
  removeActive,
  stepNamesWith,
  updateStep,
  withoutKeys,
} from '../state/state.utils.js';
import { flow } from '../../shared/utils/fp.utils.js';
import { refuse } from '../../shared/utils/result.utils.js';
import {
  applied,
  outputsFor,
  reportedOf,
  routeOf,
  stepNameOf,
  withReported,
} from './commands.utils.js';
import type { CommandResult, RunContext, StepEventOutput } from './commands.types.js';

/**
 * step-done and human: the step returned an event. Close the pass, take the edge the event resolves
 * to (counting it, or noting the cap), route to its targets and close what the route stranded.
 */

/** A spent edge takes onMax and says so; any other edge is counted. */
const takeEdge =
  (timestamp: string, name: string) =>
  (decision: EdgeDecision): Transition =>
    decision.capped
      ? recordAt(timestamp)({
          type: 'EDGE_CAPPED',
          step: name,
          message: `Edge "${decision.key}" reached its max of ${decision.max}; taking onMax -> [${decision.targets.join(', ')}].`,
          details: { edge: decision.key, max: decision.max, targets: decision.targets },
        })
      : (state: State): State => ({
          ...state,
          edges: { ...(state.edges ?? {}), [decision.key]: (state.edges?.[decision.key] ?? 0) + 1 },
        });

/** A target that was skipped earlier can run after all: back to PENDING. */
const reopenSkipped =
  (targets: readonly string[]): Transition =>
  (state: State): State =>
    flow<State>(
      ...targets
        .filter((target: string): boolean => state.steps[target]?.status === 'SKIPPED')
        .map((target: string): Transition =>
          updateStep(target, (step: StepRecord): StepRecord => ({
            ...withoutKeys(['completedAt', 'skipReason'])(step),
            status: 'PENDING',
          })),
        ),
    )(state);

export const recordStepEvent =
  (human: boolean) =>
  (context: RunContext): CommandResult<StepEventOutput> => {
    const { pipeline, input, clock }: RunContext = context;
    const route: RouteResult = routeOf(context);
    if (!route.ok) return refuse(`route:${route.reason}`)(route.error);
    const decision: EdgeDecision = route.value;
    const name: string = stepNameOf(context);
    const event: string = input.event ?? '';
    const reported: Record<string, unknown> = reportedOf(input.reports);
    const hasReported: boolean = Object.keys(reported).length > 0;
    const given: readonly string[] =
      input.outputs.length > 0 || !human ? input.outputs : (pipeline.steps[name]?.output ?? []);
    const outputs: string[] = outputsFor(input.runDir)(given);
    const next: string[] = decision.targets.filter((target: string): boolean => target !== END);
    const completedAt: string = clock.now();
    const details: Record<string, unknown> = {
      event,
      outputs,
      targets: decision.targets,
      ...(input.note ? { note: input.note } : {}),
      ...(hasReported ? { reported } : {}),
    };
    const answer: HistoryDraft = human
      ? {
          type: 'HUMAN_ANSWER',
          step: name,
          message: `Human answered "${event}" at "${name}" -> [${decision.targets.join(', ')}].`,
          details,
        }
      : {
          type: 'STEP_EVENT',
          step: name,
          message: `Step "${name}" returned "${event}" -> [${decision.targets.join(', ')}].`,
          details,
        };
    const state: State = flow<State>(
      takeEdge(completedAt, name)(decision),
      updateStep(name, (step: StepRecord): StepRecord => ({
        ...step,
        status: 'COMPLETED',
        completedAt,
        outputs,
        event,
        ...(hasReported ? { reported } : {}),
        ...(input.note ? { note: input.note } : {}),
      })),
      removeActive(name),
      reopenSkipped(next),
      addToFrontier(next),
      record(clock)(answer),
      skipStranded(pipeline, clock)(`${name} returned ${event}`),
    )(withReported(context));
    const readiness: Readiness = readinessOf(pipeline)(state);
    return applied(
      {
        step: name,
        event,
        targets: decision.targets,
        capped: decision.capped,
        ready: readiness.ready,
        waiting: readiness.waiting,
        running: readiness.running,
        skipped: stepNamesWith('SKIPPED')(state),
        finished: liveOf(state).length === 0,
      },
      state,
    );
  };
