import type { Pipeline, Scalar } from '../pipeline/pipeline.types.js';
import type { Outcome } from '../routing/index.js';
import { pairsOf } from './commands.utils.js';

const TRUE: readonly string[] = ['true', '1', 'yes'];
const FALSE: readonly string[] = ['false', '0', 'no'];

/**
 * A param keeps the type of its default: "5" becomes 5 for a numeric default and stays "5" for a
 * text one. A value that cannot take the default's type is an error.
 */
export const coerceParam =
  (name: string, fallback: Scalar) =>
  (raw: string): Outcome<Scalar> => {
    if (typeof fallback === 'boolean') {
      const lower: string = raw.toLowerCase();
      if (TRUE.includes(lower)) return { ok: true, value: true };
      if (FALSE.includes(lower)) return { ok: true, value: false };
      return { ok: false, error: `--param ${name}: "${raw}" is not a boolean` };
    }
    if (typeof fallback === 'number') {
      const parsed: number = Number(raw);
      if (raw.trim() === '' || Number.isNaN(parsed)) {
        return { ok: false, error: `--param ${name}: "${raw}" is not a number` };
      }
      if (Number.isInteger(fallback) && !Number.isInteger(parsed)) {
        return { ok: false, error: `--param ${name}: "${raw}" is not a whole number` };
      }
      return { ok: true, value: parsed };
    }
    return { ok: true, value: raw };
  };

export const declaredParams = (pipeline: Pipeline): Record<string, Scalar> => pipeline.params ?? {};

/** The --param names the pipeline does not declare. */
export const unknownParams = (pipeline: Pipeline, given: readonly string[]): string[] =>
  Object.keys(pairsOf(given)).filter(
    (name: string): boolean => !Object.hasOwn(declaredParams(pipeline), name),
  );

/** Every declared param: its --param value coerced to the default's type, else its default. */
export const paramOutcomes = (
  pipeline: Pipeline,
  given: readonly string[],
): [string, Outcome<Scalar>][] => {
  const values: Record<string, string> = pairsOf(given);
  return Object.entries(declaredParams(pipeline)).map(
    ([name, fallback]: [string, Scalar]): [string, Outcome<Scalar>] => [
      name,
      Object.hasOwn(values, name)
        ? coerceParam(name, fallback)(values[name] as string)
        : { ok: true, value: fallback },
    ],
  );
};

/** The run's params. The param guards have already refused anything that does not coerce. */
export const paramsOf = (pipeline: Pipeline, given: readonly string[]): Record<string, Scalar> =>
  Object.fromEntries(
    paramOutcomes(pipeline, given).map(
      ([name, outcome]: [string, Outcome<Scalar>]): [string, Scalar] => [
        name,
        outcome.ok ? outcome.value : '',
      ],
    ),
  );
