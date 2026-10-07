import type { EdgeEntry, Pipeline } from '../../pipeline/pipeline.types.js';
import type { Finding, PipelineContext, PipelineRule } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';
import { edgesOf, isStep } from '../../pipeline/pipeline.utils.js';

interface Hop {
  step: string;
  event: string;
}

/** step → the uncapped hops out of it. A capped edge bounds its loop, so it is left out. */
const uncappedGraph = (pipeline: Pipeline): ReadonlyMap<string, Hop[]> =>
  new Map(
    Object.keys(pipeline.steps).map((name: string): [string, Hop[]] => [
      name,
      edgesOf(pipeline.steps[name])
        .filter(([, edge]: EdgeEntry): boolean => edge.max === undefined)
        .flatMap(([event, edge]: EdgeEntry): Hop[] =>
          edge.target
            .filter(isStep(pipeline))
            .map((target: string): Hop => ({ step: target, event })),
        ),
    ]),
  );

type Mark = 'open' | 'done';

interface Search {
  marks: ReadonlyMap<string, Mark>;
  loops: readonly string[];
}

const mark =
  (name: string, value: Mark) =>
  (search: Search): Search => ({ ...search, marks: new Map([...search.marks, [name, value]]) });

/** `a:EVENT -> b:EVENT -> a` — the part of the trail from target back round to target. */
const formatLoop = (trail: readonly Hop[], target: string): string =>
  `${trail
    .slice(trail.findIndex((hop: Hop): boolean => hop.step === target))
    .map((hop: Hop): string => `${hop.step}:${hop.event}`)
    .join(' -> ')} -> ${target}`;

/** Depth-first search from name; a hop back to a step still open closes a loop. */
const visit =
  (graph: ReadonlyMap<string, Hop[]>) =>
  (search: Search, name: string, trail: readonly Hop[]): Search => {
    const explored: Search = (graph.get(name) ?? []).reduce(
      (acc: Search, { step: target, event }: Hop): Search => {
        const path: Hop[] = [...trail, { step: name, event }];
        if (acc.marks.get(target) === 'open')
          return { ...acc, loops: [...acc.loops, formatLoop(path, target)] };
        return acc.marks.has(target) ? acc : visit(graph)(acc, target, path);
      },
      mark(name, 'open')(search),
    );
    return mark(name, 'done')(explored);
  };

const findLoops = (graph: ReadonlyMap<string, Hop[]>): readonly string[] =>
  [...graph.keys()].reduce(
    (acc: Search, name: string): Search =>
      acc.marks.has(name) ? acc : visit(graph)(acc, name, []),
    { marks: new Map(), loops: [] },
  ).loops;

export const loopsCapped: PipelineRule = defineRule<PipelineContext>({
  id: 'loops-capped',
  description: 'Every loop passes through an edge with "max", so it cannot spin forever.',
})(({ pipeline }, report) =>
  findLoops(uncappedGraph(pipeline)).map((loop: string): Finding =>
    report.warning(`loop without a "max": ${loop} — that loop can spin forever`),
  ),
);
