import type { Outcome } from './condition.types.js';

/**
 * One token: an operator, a parenthesis, quoted text ('…' or "…"), a number (-1, 2.5) or a name
 * (letters, digits, _; `and`, `or`, `not`, `true`, `false` are names the parser knows).
 */
const TOKEN: RegExp =
  /\s*(>=|<=|==|!=|>|<|\(|\)|'[^']*'|"[^"]*"|-?\d+(?:\.\d+)?|[A-Za-z_][A-Za-z0-9_]*)/y;

/** Split a condition into tokens, or say where it stops making sense. */
export const tokenize = (text: string): Outcome<string[]> => {
  const from = (index: number, tokens: readonly string[]): Outcome<string[]> => {
    if (index >= text.length || text.slice(index).trim() === '') {
      return { ok: true, value: [...tokens] };
    }
    const pattern = new RegExp(TOKEN.source, 'y');
    pattern.lastIndex = index;
    const match: RegExpExecArray | null = pattern.exec(text);
    return match === null || match[1] === undefined
      ? { ok: false, error: `cannot parse condition "${text}" at "${text.slice(index)}"` }
      : from(pattern.lastIndex, [...tokens, match[1]]);
  };
  return from(0, []);
};
