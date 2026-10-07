import path from 'node:path';
import type { Clock, RunIdGenerator } from '../src/clients/clock/index.js';
import { formatNanos, parseNanos } from '../src/clients/clock/index.js';
import type { FileSystemClient } from '../src/clients/file-system/index.js';
import { execute, openCommand } from '../src/features/commands/index.js';
import type {
  CommandInput,
  CommandResult,
  OpenContext,
  RunCommand,
  RunContext,
  RunInput,
} from '../src/features/commands/index.js';
import type { Pipeline } from '../src/features/pipeline/pipeline.types.js';
import type { RecordDeps } from '../src/features/record/index.js';
import type { State } from '../src/features/state/index.js';

export const RUN_DIR = '/runs/demo/my-topic-2026-10-07';
export const START_AT = '2026-10-07T12:00:00Z';

/** Each reading 1 ms after the one before, starting at START_AT (or just after `after`). */
export const fixedClock = (after?: string): Clock => {
  const state: { last: bigint } = {
    last: after === undefined ? parseNanos(START_AT)! - 1_000_000n : parseNanos(after)!,
  };
  return {
    now: (): string => {
      state.last += 1_000_000n;
      return formatNanos(state.last);
    },
  };
};

export const fixedRunId: RunIdGenerator = (): string => 'run-20261007T120000-abcdef';

/**
 * draft → review (APPROVE → END, REVISE → draft max 2, onMax → polish → END);
 * review also fans nothing out; `side` is reachable only from START, `ask` is a human step.
 */
export const demoPipeline = (): Pipeline => ({
  $schema: '../pipeline.schema.json',
  id: 'demo-factory',
  constants: { rootPath: 'cwd', skillPath: '.', homePath: '~', tone: 'plain' },
  params: { topic: '', count: 3, strict: false },
  outputDir: '{{rootPath}}/run/{{id}}/{{slug}}-{{date}}',
  START: ['draft'],
  steps: {
    draft: {
      agent: 'general-purpose',
      prompt: ['Draft {{topic}}.'],
      transitions: { DONE: { target: ['review'] } },
    },
    review: {
      agent: 'general-purpose',
      prompt: ['Review it.'],
      transitions: {
        APPROVE: { target: ['END'] },
        REVISE: { target: ['draft'], max: 2, onMax: ['polish'] },
        ASK: { target: ['ask'] },
      },
    },
    polish: {
      agent: 'general-purpose',
      prompt: ['Polish it.'],
      transitions: { DONE: { target: ['END'] } },
    },
    ask: {
      agent: 'human',
      prompt: ['Ship it?'],
      output: ['4-ask/decision.md'],
      transitions: { YES: { target: ['END'] }, NO: { target: ['draft'], max: 1, onMax: ['END'] } },
    },
  },
});

/** split → left + right → join (fan-in) → END. */
export const fanPipeline = (): Pipeline => {
  const agent = (
    transitions: Pipeline['steps'][string]['transitions'],
  ): Pipeline['steps'][string] => ({
    agent: 'general-purpose',
    prompt: ['go'],
    transitions,
  });
  return {
    id: 'fan-factory',
    constants: { rootPath: 'cwd', skillPath: '.', homePath: '~' },
    params: { topic: '' },
    outputDir: 'run',
    START: ['split'],
    steps: {
      split: agent({ BOTH: { target: ['left', 'right'] }, LEFT: { target: ['left'] } }),
      left: agent({ DONE: { target: ['join'] } }),
      right: agent({ DONE: { target: ['join'] } }),
      join: agent({ DONE: { target: ['END'] } }),
    },
  };
};

export const inputFor = (command: string, fields: Partial<CommandInput> = {}): RunInput => ({
  command,
  runDir: RUN_DIR,
  outputs: [],
  reports: [],
  params: [],
  ...fields,
});

export const openContext = (
  pipeline: Pipeline,
  fields: Partial<CommandInput> = {},
  clock: Clock = fixedClock(),
): OpenContext => ({
  pipeline,
  input: inputFor('open', { params: ['topic=cats'], ...fields }),
  clock,
  newRunId: fixedRunId,
  pipelineFile: 'factories/demo-factory/pipeline.json',
  schemaRef: 'factories/state.schema.json',
  sessionId: 'session-1',
  stateFile: path.join(RUN_DIR, 'state.json'),
});

/** Unwrap a command result, failing the test on a refusal. */
export const stateOf = <O>(result: CommandResult<O>): State => {
  if (!result.ok) throw new Error(`refused: ${result.refusal.message}`);
  if (result.value.state === undefined) throw new Error('the command wrote nothing');
  return result.value.state;
};

export const outputOf = <O>(result: CommandResult<O>): O => {
  if (!result.ok) throw new Error(`refused: ${result.refusal.message}`);
  return result.value.output;
};

export const refusalOf = <O>(result: CommandResult<O>): { guard: string; message: string } => {
  if (result.ok) throw new Error('expected a refusal');
  return result.refusal;
};

export const openState = (pipeline: Pipeline = demoPipeline()): State =>
  stateOf(execute(openCommand)(openContext(pipeline)));

/** A RunContext for `command` against `state`, with a clock just after the state's last write. */
export const runContext = (
  state: State,
  pipeline: Pipeline,
  command: string,
  fields: Partial<CommandInput> = {},
): RunContext => ({
  state,
  pipeline,
  input: inputFor(command, fields),
  clock: fixedClock(state.updatedAt),
});

/** Run a command and return the state it would write (throws on a refusal). */
export const step =
  (pipeline: Pipeline) =>
  <O>(command: RunCommand<O>, fields: Partial<CommandInput> = {}) =>
  (state: State): State =>
    stateOf(execute(command)(runContext(state, pipeline, command.name, fields)));

/** An in-memory disk: a map of file → text; directories exist when a file is under them. */
export const memoryFileSystem = (
  initial: Readonly<Record<string, string>> = {},
): FileSystemClient & { files: Map<string, string>; writes: string[] } => {
  const files: Map<string, string> = new Map(Object.entries(initial));
  const writes: string[] = [];
  return {
    files,
    writes,
    readText: (file: string): string => {
      const text: string | undefined = files.get(file);
      if (text === undefined) throw new Error(`ENOENT: ${file}`);
      return text;
    },
    exists: (target: string): boolean =>
      files.has(target) ||
      [...files.keys()].some((file: string): boolean => file.startsWith(`${target}/`)),
    listDirectories: (): string[] => [],
    makeDirectory: (): void => undefined,
    writeTextAtomic: (file: string, text: string): void => {
      writes.push(file);
      files.set(file, text);
    },
  };
};

export const depsWith = (
  fileSystem: FileSystemClient,
  fields: Partial<RecordDeps> = {},
): RecordDeps => ({
  fileSystem,
  clockAfter: fixedClock,
  newRunId: fixedRunId,
  rootPath: '/repo',
  cwd: '/repo',
  sessionId: '',
  schemaFile: '/repo/factories/state.schema.json',
  ...fields,
});
