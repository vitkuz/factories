import path from 'node:path';
import type { FileSystemClient } from '../src/clients/file-system/index.js';
import type { Pipeline } from '../src/features/pipeline/pipeline.types.js';
import type { Finding, PipelineContext } from '../src/features/rules/index.js';

export const ROOT = '/repo';
export const FILE: string = path.join(ROOT, 'factories', 'demo-factory', 'pipeline.json');
export const LOCAL_FILE: string = path.join(
  ROOT,
  'factories.local',
  'demo-factory',
  'pipeline.json',
);

/** A small valid pipeline: start → review (loops back, capped) → END. */
export const basePipeline = (): Pipeline => ({
  $schema: '../pipeline.schema.json',
  id: 'demo-factory',
  constants: {
    rootPath: 'cwd',
    skillPath: '.',
    homePath: '~',
    factoryPath: '{{rootPath}}/factories/{{id}}',
  },
  params: { topic: '' },
  outputDir: '{{rootPath}}/run/{{id}}/{{slug}}-{{date}}',
  START: ['draft'],
  steps: {
    draft: {
      agent: 'general-purpose',
      prompt: ['Draft {{topic}}.'],
      output: ['1-draft/draft.md'],
      knowledge: ['{{factoryPath}}/knowledge/draft.md'],
      transitions: { DONE: { target: ['review'] } },
    },
    review: {
      agent: 'general-purpose',
      prompt: ['Review it.'],
      transitions: {
        APPROVE: { target: ['END'] },
        REVISE: { target: ['draft'], max: 2, onMax: ['END'] },
      },
    },
  },
});

/** An in-memory disk: the listed paths exist, nothing else does; a folder exists when a path is under it. */
export const memoryFileSystem = (
  existing: readonly string[],
  files: Readonly<Record<string, string>> = {},
): FileSystemClient => {
  const all = (): string[] => [...existing, ...Object.keys(files)];
  return {
    readText: (file: string): string => {
      const text: string | undefined = files[file];
      if (text === undefined) throw new Error(`ENOENT: ${file}`);
      return text;
    },
    exists: (target: string): boolean =>
      all().some((file: string): boolean => file === target || file.startsWith(`${target}/`)),
    listDirectories: (directory: string): string[] =>
      [
        ...new Set(
          all()
            .filter((file: string): boolean => file.startsWith(`${directory}/`))
            .map((file: string): string => file.slice(directory.length + 1).split('/')[0] ?? '')
            .filter((name: string): boolean => name !== '' && !name.includes('.')),
        ),
      ].sort(),
    glob: (pattern: string): string[] =>
      existing.filter((file: string): boolean => path.matchesGlob(file, pattern)),
  };
};

/** Everything the base pipeline needs to be clean. */
export const HEALTHY_DISK: readonly string[] = [
  path.join(ROOT, '.claude'),
  path.join(ROOT, '.claude', 'skills', 'demo-factory'),
  path.join(ROOT, 'factories', 'demo-factory', 'knowledge', 'draft.md'),
];

export const contextFor = (
  pipeline: Pipeline,
  overrides: Partial<PipelineContext> = {},
): PipelineContext => ({
  rootPath: ROOT,
  cwd: ROOT,
  homePath: '/home/me',
  fileSystem: memoryFileSystem(HEALTHY_DISK),
  pipeline,
  document: pipeline,
  file: FILE,
  ...overrides,
});

export const messages = (findings: readonly Finding[]): string[] =>
  findings.map((finding: Finding): string => `${finding.severity}: ${finding.message}`);
