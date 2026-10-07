/** Hands out RFC 3339 timestamps with nanoseconds; each one is later than the one before. */
export interface Clock {
  now: () => string;
}

/** A new run id, from the moment the run opens. */
export type RunIdGenerator = (openedAt: string) => string;
