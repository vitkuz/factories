// Copied from tools/validation/src/features/pipeline/pipeline.utils.ts — keep the two copies in step.
import path from 'node:path';
import type { Edge, EdgeEntry, Pipeline, Scalar, Step, StringAt } from './pipeline.types.js';

export const END = 'END';
export const PIPELINE_FILE = 'pipeline.json';
/** The shared kit (a git submodule in every project). */
export const FACTORIES_DIR = 'factories';
/** The project's own factories, same layout; an id here shadows the shared one. */
export const LOCAL_FACTORIES_DIR = 'factories.local';
/** Where an id is looked up, in order. */
export const FACTORY_DIRS: readonly string[] = [LOCAL_FACTORIES_DIR, FACTORIES_DIR];
/** What a run writes and reads back across runs (insight stores, lessons): never inside the kit. */
export const FACTORY_DATA_DIR = 'factory-data';
export const SKILLS_DIR: string = path.join('.claude', 'skills');
export const SHARED_SCHEMA: string = path.join(FACTORIES_DIR, 'pipeline.schema.json');

/** Names every pipeline may use without declaring them. */
export const BUILT_INS: readonly string[] = ['id', 'slug', 'date', 'outputDir'];
/** The three path anchors every `constants` opens with, in this order. */
export const ANCHORS: readonly string[] = ['rootPath', 'skillPath', 'homePath'];

const PLACEHOLDER: RegExp = /\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g;

// --- where things live -----------------------------------------------------------------------

/** <root>/<dir>/<id>/pipeline.json */
export const pipelineFileIn =
  (dir: string) =>
  (rootPath: string) =>
  (id: string): string =>
    path.join(rootPath, dir, id, PIPELINE_FILE);

/** <root>/factories/<id>/pipeline.json: the shared place for an id. */
export const pipelineFileFor: (rootPath: string) => (id: string) => string =
  pipelineFileIn(FACTORIES_DIR);

/** <root>/factories.local/<id>/pipeline.json: the project's own place for an id. */
export const localPipelineFileFor: (rootPath: string) => (id: string) => string =
  pipelineFileIn(LOCAL_FACTORIES_DIR);

const isUnder =
  (folder: string) =>
  (file: string): boolean =>
    path.resolve(file).startsWith(path.resolve(folder) + path.sep);

/** The factory folder (`factories.local` or `factories`) a pipeline file sits in, if any. */
export const factoriesDirOf = (rootPath: string, file: string): string | undefined =>
  FACTORY_DIRS.find((dir: string): boolean => isUnder(path.join(rootPath, dir))(file));

/** True for a path under <root>/factory-data/: the project's own run data. */
export const isProjectData =
  (rootPath: string) =>
  (file: string): boolean =>
    isUnder(path.join(rootPath, FACTORY_DATA_DIR))(file);

/** <root>/.claude/skills/<id>: the factory's wrapper skill folder, what {{skillPath}} resolves to. */
export const wrapperSkillDirFor =
  (rootPath: string) =>
  (id: string): string =>
    path.join(rootPath, SKILLS_DIR, id);

export const sharedSchemaFor = (rootPath: string): string => path.join(rootPath, SHARED_SCHEMA);

// --- placeholders ----------------------------------------------------------------------------

/** The names inside every {{name}} of a text, in order, duplicates kept. */
export const placeholdersIn = (text: string): string[] =>
  [...text.matchAll(PLACEHOLDER)].map((match: RegExpMatchArray): string => match[1] ?? '');

export const hasPlaceholder = (text: string): boolean => placeholdersIn(text).length > 0;

export const hasGlob = (text: string): boolean => /[*?[]/.test(text);

/** Replace {{name}} from values, repeatedly, so constants may build on anchors. */
export const substitute =
  (values: Readonly<Record<string, Scalar>>) =>
  (text: string): string => {
    const once = (current: string): string =>
      current.replace(PLACEHOLDER, (whole: string, name: string): string =>
        name in values ? String(values[name]) : whole,
      );
    const settle = (current: string, rounds: number): string => {
      const next: string = once(current);
      return next === current || rounds <= 1 ? next : settle(next, rounds - 1);
    };
    return settle(text, 5);
  };

/**
 * What a path resolves against before a run: the constants, the built-in {{id}}, then the anchors —
 * {{rootPath}} the harness root, {{skillPath}} the wrapper skill folder, {{homePath}} the user's home.
 */
export const staticValues =
  (rootPath: string, homePath: string) =>
  (pipeline: Pipeline): Record<string, Scalar> => ({
    ...pipeline.constants,
    id: pipeline.id,
    rootPath,
    skillPath: wrapperSkillDirFor(rootPath)(pipeline.id),
    homePath,
  });

/** Every [jsonPath, string] in the document, the top-level $schema excluded. */
export const stringsIn = (node: unknown, where: string = 'pipeline'): StringAt[] => {
  if (typeof node === 'string') return [[where, node]];
  if (Array.isArray(node))
    return node.flatMap((value: unknown, index: number): StringAt[] =>
      stringsIn(value, `${where}[${index}]`),
    );
  if (node !== null && typeof node === 'object')
    return Object.entries(node).flatMap(([key, value]: [string, unknown]): StringAt[] =>
      where === 'pipeline' && key === '$schema' ? [] : stringsIn(value, `${where}.${key}`),
    );
  return [];
};

// --- graph -----------------------------------------------------------------------------------

export const stepEntries = (pipeline: Pipeline): [string, Step][] => Object.entries(pipeline.steps);

export const edgesOf = (step: Step | undefined): EdgeEntry[] =>
  Object.entries(step?.transitions ?? {});

/** Every name an edge can route to: its target, plus its onMax escape. */
export const targetsOf = (edge: Edge): string[] => [...edge.target, ...(edge.onMax ?? [])];

export const isStep =
  (pipeline: Pipeline) =>
  (name: string): boolean =>
    Object.hasOwn(pipeline.steps, name);

/** The START names that are declared steps. */
export const declaredStarts = (pipeline: Pipeline): string[] =>
  pipeline.START.filter(isStep(pipeline));

const neighbours =
  (pipeline: Pipeline) =>
  (name: string): string[] =>
    edgesOf(pipeline.steps[name]).flatMap(([, edge]: EdgeEntry): string[] => targetsOf(edge));

/** Every name reachable from starts — END included when an edge points at it. */
export const reachableFrom =
  (pipeline: Pipeline) =>
  (starts: readonly string[]): Set<string> => {
    const next = neighbours(pipeline);
    const walk = (queue: readonly string[], seen: ReadonlySet<string>): Set<string> => {
      const [head, ...rest]: readonly string[] = queue;
      if (head === undefined) return new Set(seen);
      if (seen.has(head)) return walk(rest, seen);
      const expand: string[] = head !== END && isStep(pipeline)(head) ? next(head) : [];
      return walk([...rest, ...expand], new Set([...seen, head]));
    };
    return walk(starts, new Set());
  };
