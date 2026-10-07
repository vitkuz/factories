/** Why the recorder will not do something. `guard` names the check that said no. */
export interface Refusal {
  guard: string;
  message: string;
}

/** A value, or the refusal that stopped it. Nothing in the recorder throws to refuse. */
export type Result<T> = { ok: true; value: T } | { ok: false; refusal: Refusal };
