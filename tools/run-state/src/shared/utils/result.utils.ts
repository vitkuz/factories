import type { Refusal, Result } from '../types/result.types.js';

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });

export const refuse =
  (guard: string) =>
  <T = never>(message: string): Result<T> => ({ ok: false, refusal: { guard, message } });

export const refusedWith = <T = never>(refusal: Refusal): Result<T> => ({ ok: false, refusal });

/** Feed a success into the next step; a refusal passes through untouched. */
export const chain =
  <A, B>(next: (value: A) => Result<B>) =>
  (result: Result<A>): Result<B> =>
    result.ok ? next(result.value) : result;

export const map =
  <A, B>(change: (value: A) => B) =>
  (result: Result<A>): Result<B> =>
    result.ok ? ok(change(result.value)) : result;
