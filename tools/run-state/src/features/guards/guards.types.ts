import type { Refusal } from '../../shared/types/result.types.js';

export interface GuardMeta {
  /** kebab-case, unique; printed by --list-guards. */
  id: string;
  /** One sentence: what must hold for the command to go ahead. */
  description: string;
}

/** One refusal check: undefined when the command may go ahead, else the refusal. */
export interface Guard<Context> extends GuardMeta {
  check: (context: Context) => Refusal | undefined;
}
