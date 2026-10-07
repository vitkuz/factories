import type { z } from 'zod';
import { pipelineSchema } from '../pipeline.schema.js';
import type { Pipeline } from '../pipeline.types.js';

export type ParseResult = { ok: true; pipeline: Pipeline } | { ok: false; issues: string[] };

type Issue = z.core.$ZodIssue;
type PathKey = PropertyKey;

/** pipeline.steps.review.transitions.DONE.target[0] */
const formatPath = (keys: readonly PathKey[]): string =>
  keys.reduce(
    (acc: string, key: PathKey): string =>
      typeof key === 'number' ? `${acc}[${key}]` : `${acc}.${String(key)}`,
    'pipeline',
  );

/** The JSON type of a value, telling integers from other numbers. */
const jsonType = (value: unknown): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number';
  return typeof value;
};

const EXPECTED: Readonly<Record<string, string>> = { int: 'integer', record: 'object' };

/** One Zod issue → the "<path>: <message>" lines it stands for. */
const describe = (issue: Issue): string[] => {
  const at: string = formatPath(issue.path);
  if (issue.code === 'invalid_type' && issue.input === undefined) {
    const key: string = String(issue.path[issue.path.length - 1] ?? '');
    return [`${formatPath(issue.path.slice(0, -1))}: missing required "${key}"`];
  }
  if (issue.code === 'invalid_type') {
    const expected: string = EXPECTED[issue.expected] ?? issue.expected;
    return [`${at}: must be ${expected}, got ${jsonType(issue.input)}`];
  }
  if (issue.code === 'unrecognized_keys') {
    return issue.keys.map((key: string): string => `${at}: unexpected key "${key}"`);
  }
  if (issue.code === 'invalid_key') {
    const key: string = String(issue.path[issue.path.length - 1] ?? '');
    const parent: string = formatPath(issue.path.slice(0, -1));
    return issue.issues.map((inner: Issue): string => `${parent}.<key ${key}>: ${inner.message}`);
  }
  return [`${at}: ${issue.message}`];
};

/** Check the document against the Zod shape; a typed Pipeline, or every complaint as text. */
export const parsePipeline = (document: unknown): ParseResult => {
  const result = pipelineSchema.safeParse(document, { reportInput: true });
  return result.success
    ? { ok: true, pipeline: result.data }
    : { ok: false, issues: [...new Set(result.error.issues.flatMap(describe))] };
};
