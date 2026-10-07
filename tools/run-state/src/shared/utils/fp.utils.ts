// Copied from tools/validation/src/shared/utils/fp.utils.ts — keep the two copies in step.
type Fn<A, B> = (value: A) => B;

/** Left-to-right composition: `pipe(f, g, h)(x)` is `h(g(f(x)))`. */
export function pipe<A, B>(ab: Fn<A, B>): Fn<A, B>;
export function pipe<A, B, C>(ab: Fn<A, B>, bc: Fn<B, C>): Fn<A, C>;
export function pipe<A, B, C, D>(ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>): Fn<A, D>;
export function pipe<A, B, C, D, E>(
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
): Fn<A, E>;
export function pipe<A, B, C, D, E, F>(
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
  ef: Fn<E, F>,
): Fn<A, F>;
export function pipe(...fns: Fn<unknown, unknown>[]): Fn<unknown, unknown> {
  return (value: unknown): unknown =>
    fns.reduce((acc: unknown, fn: Fn<unknown, unknown>): unknown => fn(acc), value);
}

/** Same-type composition of any length — what a chain of state transitions is. */
export const flow =
  <T>(...fns: Fn<T, T>[]): Fn<T, T> =>
  (value: T): T =>
    fns.reduce((acc: T, fn: Fn<T, T>): T => fn(acc), value);

export const unique = <T>(items: readonly T[]): T[] => [...new Set(items)];
