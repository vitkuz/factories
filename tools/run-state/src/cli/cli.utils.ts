/** 0: done (and written). 1: something broke (nothing promised). 2: refused, or a bad call; nothing written. */
export const EXIT = { ok: 0, error: 1, refused: 2 } as const;

export type ExitCode = (typeof EXIT)[keyof typeof EXIT];

/** The options commander hands back, before they become a CommandInput. */
export interface ParsedOptions {
  param?: string[];
  pipeline?: string;
  event?: string;
  answer?: string;
  output?: string[];
  report?: string[];
  note?: string;
  error?: string;
  reason?: string;
}

export interface Output {
  out: (text: string) => void;
  err: (text: string) => void;
}
