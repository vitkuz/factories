const NANOS_PER_MS = 1_000_000n;
const NANOS_PER_SECOND = 1_000_000_000n;
const RFC3339: RegExp = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d{1,9}))?Z$/;

/** 2026-10-07T13:15:00.000000123Z, trailing zeros of the fraction trimmed (none at all on a whole second). */
export const formatNanos = (ns: bigint): string => {
  const seconds: string = new Date(Number(ns / NANOS_PER_MS)).toISOString().slice(0, 19);
  const fraction: string = (ns % NANOS_PER_SECOND).toString().padStart(9, '0').replace(/0+$/, '');
  return `${seconds}${fraction ? `.${fraction}` : ''}Z`;
};

/** The reverse of formatNanos, for a UTC timestamp; undefined for anything else. */
export const parseNanos = (timestamp: string): bigint | undefined => {
  const match: RegExpExecArray | null = RFC3339.exec(timestamp);
  if (match === null || match[1] === undefined) return undefined;
  const ms: number = Date.parse(`${match[1]}Z`);
  return Number.isNaN(ms)
    ? undefined
    : BigInt(ms) * NANOS_PER_MS + BigInt((match[2] ?? '').padEnd(9, '0'));
};

/** run-20261007T131500-a1b2c3: the moment the run opened, then six hex digits. */
export const runIdFor = (openedAt: string, hex: string): string =>
  `run-${openedAt.replace(/[-:]/g, '').slice(0, 15)}-${hex}`;
