import type { ConditionValue, Lookup, Outcome } from './condition.types.js';
import { tokenize } from './tokenize.utils.js';

/**
 * An edge condition, evaluated. Grammar, loosest first:
 *
 *   or          := and ('or' and)*
 *   and         := comparison ('and' comparison)*
 *   comparison  := value (('>' | '>=' | '<' | '<=' | '==' | '!=') value)?
 *   value       := '(' or ')' | 'not' value | true | false | 'text' | "text" | number | name
 *
 * Kept exactly as the old recorder had it: both sides of `and` / `or` are always evaluated (an
 * unknown name on either side is an error), `==` and `!=` compare loosely (3 == '3'), and
 * `not` binds to the value next to it (`not a > 1` is `(not a) > 1`).
 */

type Parsed = Outcome<{ value: ConditionValue; at: number }>;

const COMPARE: Readonly<Record<string, (left: ConditionValue, right: ConditionValue) => boolean>> =
  {
    '>': (left, right) => (left as number) > (right as number),
    '>=': (left, right) => (left as number) >= (right as number),
    '<': (left, right) => (left as number) < (right as number),
    '<=': (left, right) => (left as number) <= (right as number),
    // eslint-disable-next-line eqeqeq
    '==': (left, right) => left == right,
    // eslint-disable-next-line eqeqeq
    '!=': (left, right) => left != right,
  };

const parsed = (value: ConditionValue, at: number): Parsed => ({ ok: true, value: { value, at } });

const failed = (error: string): Parsed => ({ ok: false, error });

/** `then` runs on a successful parse; an error passes through. */
const then =
  (next: (value: ConditionValue, at: number) => Parsed) =>
  (result: Parsed): Parsed =>
    result.ok ? next(result.value.value, result.value.at) : result;

const parserFor = (text: string, tokens: readonly string[], lookup: Lookup) => {
  const literal = (token: string, at: number): Parsed => {
    if (token === 'true') return parsed(true, at);
    if (token === 'false') return parsed(false, at);
    if (/^['"]/.test(token)) return parsed(token.slice(1, -1), at);
    if (/^-?\d/.test(token)) return parsed(Number(token), at);
    const found: Outcome<ConditionValue> = lookup(token);
    return found.ok ? parsed(found.value, at) : failed(found.error);
  };

  const value = (at: number): Parsed => {
    const token: string | undefined = tokens[at];
    if (token === undefined) return failed(`condition "${text}" ends too early`);
    if (token === '(') {
      return then((inner: ConditionValue, after: number): Parsed =>
        tokens[after] === ')' ? parsed(inner, after + 1) : failed(`condition "${text}" misses ")"`),
      )(or(at + 1));
    }
    if (token === 'not') {
      return then((inner: ConditionValue, after: number): Parsed => parsed(!inner, after))(
        value(at + 1),
      );
    }
    return literal(token, at + 1);
  };

  const comparison = (at: number): Parsed =>
    then((left: ConditionValue, after: number): Parsed => {
      const compare = COMPARE[tokens[after] ?? ''];
      return compare === undefined
        ? parsed(left, after)
        : then((right: ConditionValue, end: number): Parsed => parsed(compare(left, right), end))(
            value(after + 1),
          );
    })(value(at));

  /** `left (keyword right)*`, folded with `combine(right, left)`. */
  const chainOf =
    (
      keyword: string,
      operand: (at: number) => Parsed,
      combine: (right: ConditionValue, left: ConditionValue) => ConditionValue,
    ) =>
    (at: number): Parsed => {
      const more = (left: ConditionValue, after: number): Parsed =>
        tokens[after] === keyword
          ? then((right: ConditionValue, end: number): Parsed => more(combine(right, left), end))(
              operand(after + 1),
            )
          : parsed(left, after);
      return then(more)(operand(at));
    };

  const and: (at: number) => Parsed = chainOf('and', comparison, (right, left) => right && left);
  const or: (at: number) => Parsed = chainOf(
    'or',
    (at: number): Parsed => and(at),
    (right, left) => right || left,
  );

  return or;
};

/** True or false, or why the condition cannot be evaluated (bad syntax, an unknown name). */
export const evaluateCondition =
  (lookup: Lookup) =>
  (text: string): Outcome<boolean> => {
    const tokens: Outcome<string[]> = tokenize(text);
    if (!tokens.ok) return tokens;
    const result: Parsed = parserFor(text, tokens.value, lookup)(0);
    if (!result.ok) return result;
    return result.value.at < tokens.value.length
      ? {
          ok: false,
          error: `condition "${text}" has extra "${tokens.value.slice(result.value.at).join(' ')}"`,
        }
      : { ok: true, value: Boolean(result.value.value) };
  };
