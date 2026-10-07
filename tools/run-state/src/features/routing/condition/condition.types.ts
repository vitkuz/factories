/** What a name in a condition resolves to: a param, a constant, a built-in or a reported value. */
export type ConditionValue = unknown;

/** A value, or what went wrong, in words. */
export type Outcome<T> = { ok: true; value: T } | { ok: false; error: string };

/** Resolves a bare name in a condition; an unknown name is an error. */
export type Lookup = (name: string) => Outcome<ConditionValue>;
