import { describe, expect, it } from 'vitest';
import { evaluateCondition, tokenize } from '../src/features/routing/index.js';
import type { ConditionValue, Lookup, Outcome } from '../src/features/routing/index.js';

const scope: Record<string, ConditionValue> = {
  score: 7,
  lang: 'en',
  strict: true,
  zero: 0,
  label: '3',
};

const lookup: Lookup = (name: string): Outcome<ConditionValue> =>
  Object.hasOwn(scope, name)
    ? { ok: true, value: scope[name] }
    : { ok: false, error: `unknown ${name}` };

const evaluate = (text: string): Outcome<boolean> => evaluateCondition(lookup)(text);

describe('tokenize', () => {
  it('splits operators, parentheses, quoted text, numbers and names', () => {
    expect(tokenize(`(score>=7) and lang == 'en' or x != "a b" and -1.5 < y`)).toEqual({
      ok: true,
      value: [
        '(',
        'score',
        '>=',
        '7',
        ')',
        'and',
        'lang',
        '==',
        "'en'",
        'or',
        'x',
        '!=',
        '"a b"',
        'and',
        '-1.5',
        '<',
        'y',
      ],
    });
  });

  it('ignores surrounding whitespace, and an empty condition has no tokens', () => {
    expect(tokenize('  a  ')).toEqual({ ok: true, value: ['a'] });
    expect(tokenize('   ')).toEqual({ ok: true, value: [] });
  });

  it('says where it stops making sense', () => {
    expect(tokenize('score >= 7 && x')).toEqual({
      ok: false,
      error: 'cannot parse condition "score >= 7 && x" at " && x"',
    });
  });
});

describe('evaluateCondition', () => {
  it.each([
    ['score >= 7', true],
    ['score > 7', false],
    ['score < 8 and score <= 7', true],
    ["lang == 'en'", true],
    ['lang != "en"', false],
    ['not strict', false],
    ['not strict or score == 7', true],
    ["(score > 9 or lang == 'en') and strict", true],
    ['true and not false', true],
    ['zero', false],
    ['-1 < zero', true],
    ['2.5 > 2', true],
  ])('%s → %s', (text: string, expected: boolean) => {
    expect(evaluate(text)).toEqual({ ok: true, value: expected });
  });

  it('compares loosely, like the old recorder (3 == "3")', () => {
    expect(evaluate('label == 3')).toEqual({ ok: true, value: true });
  });

  it('binds not to the value next to it: not score > 1 is (not score) > 1', () => {
    expect(evaluate('not score > -1')).toEqual({ ok: true, value: true });
  });

  it('evaluates both sides of and/or, so an unknown name always fails', () => {
    expect(evaluate('false and ghost')).toEqual({ ok: false, error: 'unknown ghost' });
    expect(evaluate('true or ghost')).toEqual({ ok: false, error: 'unknown ghost' });
  });

  it('refuses a condition that ends early, misses ")" or has extra tokens', () => {
    expect(evaluate('score >')).toEqual({ ok: false, error: 'condition "score >" ends too early' });
    expect(evaluate('(score > 1')).toEqual({
      ok: false,
      error: 'condition "(score > 1" misses ")"',
    });
    expect(evaluate('score > 1 2')).toEqual({
      ok: false,
      error: 'condition "score > 1 2" has extra "2"',
    });
  });

  it('passes a tokenizer error through', () => {
    expect(evaluate('a ~ b')).toEqual({
      ok: false,
      error: 'cannot parse condition "a ~ b" at " ~ b"',
    });
  });
});
