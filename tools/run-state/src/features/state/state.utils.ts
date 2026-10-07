import path from 'node:path';
import type { Clock } from '../../clients/clock/index.js';
import { unique } from '../../shared/utils/fp.utils.js';
import type {
  HistoryDraft,
  HistoryEntry,
  RunStatus,
  State,
  StepRecord,
  Transition,
} from './state.types.js';

export const STATE_FILE = 'state.json';

export const statePathFor = (runDir: string): string => path.join(path.resolve(runDir), STATE_FILE);

// --- the written form ------------------------------------------------------------------------
// state.json lists keys in a fixed order and sorts every map, so two runs that did the same thing
// read the same, and a diff shows only what changed.

const TOP_KEYS: readonly (keyof State)[] = [
  '$schema',
  'runId',
  'pipelineName',
  'pipelineFile',
  'sessionId',
  'sessionSource',
  'transcriptPath',
  'status',
  'createdAt',
  'updatedAt',
  'currentWave',
  'activeSteps',
  'context',
  'pause',
  'steps',
  'history',
  'mode',
  'frontier',
  'edges',
  'vars',
];

const STEP_KEYS: readonly (keyof StepRecord)[] = [
  'order',
  'kind',
  'agent',
  'sessionId',
  'transcriptPath',
  'status',
  'startedAt',
  'completedAt',
  'outputs',
  'retryCount',
  'error',
  'skipReason',
  'childPipeline',
  'passes',
  'event',
  'reported',
  'note',
];

const HISTORY_KEYS: readonly (keyof HistoryEntry)[] = [
  'timestamp',
  'type',
  'step',
  'message',
  'details',
];

/** Only `keys`, in that order; a key whose value is undefined is left out. */
const pickKeys =
  <T extends object>(keys: readonly (keyof T)[]) =>
  (value: T): T =>
    Object.fromEntries(
      keys
        .filter((key: keyof T): boolean => value[key] !== undefined)
        .map((key: keyof T): [keyof T, T[keyof T]] => [key, value[key]]),
    ) as T;

export const sortKeys = <V>(record: Readonly<Record<string, V>>): Record<string, V> =>
  Object.fromEntries(
    Object.keys(record)
      .sort()
      .map((key: string): [string, V] => [key, record[key] as V]),
  );

const nonEmpty = <T>(items: readonly T[] | undefined): T[] | undefined =>
  items !== undefined && items.length > 0 ? [...items] : undefined;

const normalizeEntry = (entry: HistoryEntry): HistoryEntry =>
  pickKeys<HistoryEntry>(HISTORY_KEYS)({
    ...entry,
    details: entry.details === undefined ? undefined : sortKeys(entry.details),
  });

/** The written form of a state: fixed key order, sorted maps, empty `frontier` and `vars` dropped. */
export const normalizeState = (state: State): State =>
  pickKeys<State>(TOP_KEYS)({
    ...state,
    steps: sortKeys(
      Object.fromEntries(
        Object.entries(state.steps).map(
          ([name, step]: [string, StepRecord]): [string, StepRecord] => [
            name,
            pickKeys<StepRecord>(STEP_KEYS)(step),
          ],
        ),
      ),
    ),
    history: (state.history ?? []).map(normalizeEntry),
    edges: sortKeys(state.edges ?? {}),
    frontier: nonEmpty(state.frontier),
    vars:
      state.vars !== undefined && Object.keys(state.vars).length > 0
        ? sortKeys(state.vars)
        : undefined,
  });

/** What lands on disk: the written form, two-space JSON, one trailing newline. */
export const serializeState = (state: State): string =>
  `${JSON.stringify(normalizeState(state), null, 2)}\n`;

// --- reading ---------------------------------------------------------------------------------

export const activeOf = (state: State): string[] => state.activeSteps ?? [];

export const frontierOf = (state: State): string[] => state.frontier ?? [];

/** Steps that are running or routed to: what can still move the run. */
export const liveOf = (state: State): string[] =>
  unique([...activeOf(state), ...frontierOf(state)]);

/**
 * The step records sorted by name — the order state.json holds them in. Whatever walks the steps
 * walks them in this order, so a result never depends on the key order of the state handed in.
 */
export const stepEntriesOf = (state: State): [string, StepRecord][] =>
  Object.entries(sortKeys(state.steps));

export const stepNamesWith =
  (status: StepRecord['status']) =>
  (state: State): string[] =>
    stepEntriesOf(state)
      .filter(([, step]: [string, StepRecord]): boolean => step.status === status)
      .map(([name]: [string, StepRecord]): string => name);

// --- transitions -----------------------------------------------------------------------------

/** Append a history entry stamped `timestamp`; the run's updatedAt follows it. */
export const recordAt =
  (timestamp: string) =>
  (draft: HistoryDraft): Transition =>
  (state: State): State => ({
    ...state,
    history: [...(state.history ?? []), { timestamp, ...draft }],
    updatedAt: timestamp,
  });

/** Append a history entry stamped by the clock when the transition runs. */
export const record =
  (clock: Clock) =>
  (draft: HistoryDraft): Transition =>
  (state: State): State =>
    recordAt(clock.now())(draft)(state);

export const setStatus =
  (status: RunStatus): Transition =>
  (state: State): State => ({ ...state, status });

export const updateStep =
  (name: string, change: (step: StepRecord) => StepRecord): Transition =>
  (state: State): State => {
    const step: StepRecord | undefined = state.steps[name];
    return step === undefined
      ? state
      : { ...state, steps: { ...state.steps, [name]: change(step) } };
  };

export const addActive =
  (name: string): Transition =>
  (state: State): State => ({ ...state, activeSteps: [...activeOf(state), name] });

export const removeActive =
  (name: string): Transition =>
  (state: State): State => ({
    ...state,
    activeSteps: activeOf(state).filter((other: string): boolean => other !== name),
  });

export const setFrontier =
  (names: readonly string[]): Transition =>
  (state: State): State => ({ ...state, frontier: [...names] });

export const addToFrontier =
  (names: readonly string[]): Transition =>
  (state: State): State => ({ ...state, frontier: unique([...frontierOf(state), ...names]) });

export const removeFromFrontier =
  (name: string): Transition =>
  (state: State): State => ({
    ...state,
    frontier: frontierOf(state).filter((other: string): boolean => other !== name),
  });

/** Drop `keys` from a step record. */
export const withoutKeys =
  (keys: readonly (keyof StepRecord)[]) =>
  (step: StepRecord): StepRecord =>
    Object.fromEntries(
      Object.entries(step).filter(
        ([key]: [string, unknown]): boolean => !keys.includes(key as keyof StepRecord),
      ),
    ) as StepRecord;

/** Close a step that will never run, and say why in its record and in the history. */
export const skipStep =
  (clock: Clock) =>
  (name: string, reason: string, unreachable: boolean): Transition =>
  (state: State): State => {
    const timestamp: string = clock.now();
    return recordAt(timestamp)({
      type: 'STEP_SKIP',
      step: name,
      message: `Step "${name}" skipped: ${reason}.`,
      details: { reason, unreachable },
    })(
      updateStep(name, (step: StepRecord): StepRecord => ({
        ...step,
        status: 'SKIPPED',
        completedAt: timestamp,
        skipReason: reason,
      }))(state),
    );
  };
