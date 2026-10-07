import { randomBytes } from 'node:crypto';
import { formatNanos, parseNanos, runIdFor } from './clock.utils.js';
import type { Clock, RunIdGenerator } from './types.js';

/**
 * The wall clock at nanosecond grain (Date.now() plus the monotonic hrtime since start). Strictly
 * increasing: a reading that would not move forward is the last one plus 1 ns. `after` is the last
 * timestamp the run recorded, so a new process never writes one earlier than the file already holds.
 *
 * The only mutable value in the tool lives here, in this closure: that is what a clock is.
 */
export const createSystemClock = (after?: string): Clock => {
  const hrBase: bigint = process.hrtime.bigint();
  const epochNs: bigint = BigInt(Date.now()) * 1_000_000n;
  let last: bigint = (after === undefined ? undefined : parseNanos(after)) ?? 0n;
  return {
    now: (): string => {
      const candidate: bigint = epochNs + (process.hrtime.bigint() - hrBase);
      last = candidate > last ? candidate : last + 1n;
      return formatNanos(last);
    },
  };
};

export const createRunIdGenerator =
  (): RunIdGenerator =>
  (openedAt: string): string =>
    runIdFor(openedAt, randomBytes(3).toString('hex'));
