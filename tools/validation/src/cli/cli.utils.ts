/** 0: no errors (the gate is open). 1: the pipeline has errors. 2: the call itself was wrong. */
export const EXIT = { ok: 0, invalid: 1, usage: 2 } as const;

export type ExitCode = (typeof EXIT)[keyof typeof EXIT];

export interface CliOptions {
  root?: string;
  json: boolean;
  listRules: boolean;
}
