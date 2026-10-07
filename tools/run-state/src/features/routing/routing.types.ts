/** Where a returned event goes, once its condition, max and onMax are applied. */
export interface EdgeDecision {
  /** `step:EVENT` of the edge taken — the key its count is kept under in state.edges. */
  key: string;
  /** The event whose edge was taken: the returned one, or the fallback when its condition is false. */
  taken: string;
  targets: string[];
  /** True when the edge's max was spent and onMax was taken instead. */
  capped: boolean;
  /** The edge's max, when capped. */
  max?: number;
}

/** Why an event cannot be routed. Each reason is refused by its own guard. */
export type RouteFailureReason = 'unknown-event' | 'bad-condition' | 'no-fallback' | 'cap-spent';

export type RouteResult =
  { ok: true; value: EdgeDecision } | { ok: false; reason: RouteFailureReason; error: string };

/** What may start now: routed steps nothing live can still reach, and those that must wait. */
export interface Readiness {
  ready: string[];
  running: string[];
  /** step → the live steps it waits for (fan-in). */
  waiting: Record<string, string[]>;
}

/** The scopes a condition name is looked up in; the first that has it wins. */
export interface ConditionScopes {
  /** Values steps reported (--report), merged over the whole run. */
  vars: Readonly<Record<string, unknown>>;
  params: Readonly<Record<string, unknown>>;
  constants: Readonly<Record<string, unknown>>;
  /** id, date (the run's creation day), slug (the run folder's name without its date). */
  builtIns: Readonly<Record<string, unknown>>;
}
