import { END, edgesOf, isStep, targetsOf } from './pipeline.utils.js';
import type { EdgeEntry, Pipeline } from './pipeline.types.js';

/**
 * The walks the recorder needs beyond the copied pipeline.utils.ts: a choice of neighbours, a place
 * to stop, and each step's layer. Pure.
 */

/** Which names a step leads to. */
export type Neighbours = (pipeline: Pipeline) => (name: string) => string[];

/** Every edge: its target and its onMax escape. */
export const allNeighbours: Neighbours =
  (pipeline: Pipeline) =>
  (name: string): string[] =>
    edgesOf(pipeline.steps[name]).flatMap(([, edge]: EdgeEntry): string[] => targetsOf(edge));

/**
 * Forward edges only. Every loop closes through an edge with `max`, so dropping those leaves a graph
 * without cycles; onMax targets are exits, so they stay.
 */
export const forwardNeighbours: Neighbours =
  (pipeline: Pipeline) =>
  (name: string): string[] =>
    edgesOf(pipeline.steps[name]).flatMap(([, edge]: EdgeEntry): string[] => [
      ...(edge.max === undefined ? edge.target : []),
      ...(edge.onMax ?? []),
    ]);

/**
 * Every name reachable from `starts` (the starts themselves, and END when an edge points at it),
 * walking `next` and never past `stopAt`.
 */
export const reachableVia =
  (next: Neighbours) =>
  (pipeline: Pipeline) =>
  (starts: readonly string[], stopAt?: string): Set<string> => {
    const expand: (name: string) => string[] = next(pipeline);
    const walk = (queue: readonly string[], seen: ReadonlySet<string>): Set<string> => {
      const [head, ...rest]: readonly string[] = queue;
      if (head === undefined) return new Set(seen);
      if (seen.has(head)) return walk(rest, seen);
      const more: string[] =
        head !== END && head !== stopAt && isStep(pipeline)(head) ? expand(head) : [];
      return walk([...rest, ...more], new Set([...seen, head]));
    };
    return walk(starts, new Set());
  };

/** Layer of each step, breadth first from START (a START step is 1); unreachable steps are absent. */
export const layersOf = (pipeline: Pipeline): Record<string, number> => {
  const next: (name: string) => string[] = allNeighbours(pipeline);
  const walk = (
    queue: readonly (readonly [string, number])[],
    layers: Readonly<Record<string, number>>,
  ): Record<string, number> => {
    const [head, ...rest]: readonly (readonly [string, number])[] = queue;
    if (head === undefined) return { ...layers };
    const [name, depth]: readonly [string, number] = head;
    if (name === END || Object.hasOwn(layers, name) || !isStep(pipeline)(name)) {
      return walk(rest, layers);
    }
    const more: (readonly [string, number])[] = next(name).map(
      (other: string): readonly [string, number] => [other, depth + 1],
    );
    return walk([...rest, ...more], { ...layers, [name]: depth });
  };
  return walk(
    pipeline.START.map((name: string): readonly [string, number] => [name, 1]),
    {},
  );
};
