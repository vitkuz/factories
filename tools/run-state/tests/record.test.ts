import { describe, expect, it } from 'vitest';
import {
  finishCommand,
  openCommand,
  showCommand,
  startCommand,
  startStepCommand,
  stepDoneCommand,
} from '../src/features/commands/index.js';
import type { CommandInput, RunCommand, ShowCommand } from '../src/features/commands/index.js';
import type { Pipeline } from '../src/features/pipeline/pipeline.types.js';
import { openRunFactory, runCommandFactory } from '../src/features/record/index.js';
import type { RecordDeps } from '../src/features/record/index.js';
import { serializeState, stateSchema } from '../src/features/state/index.js';
import type { Result } from '../src/shared/types/result.types.js';
import { demoPipeline, depsWith, memoryFileSystem } from './helpers.js';

const PIPELINE_FILE = '/repo/factories/demo-factory/pipeline.json';
const RUN = '/repo/run/demo-factory/my-topic-2026-10-07';
const STATE = `${RUN}/state.json`;

const disk = (pipeline: Pipeline = demoPipeline()) =>
  memoryFileSystem({ [PIPELINE_FILE]: JSON.stringify(pipeline) });

const raw = (command: string, fields: Partial<CommandInput> = {}): CommandInput => ({
  command,
  runDir: 'run/demo-factory/my-topic-2026-10-07',
  outputs: [],
  reports: [],
  params: [],
  ...fields,
});

const open = (deps: RecordDeps, fields: Partial<CommandInput> = {}): Result<unknown> =>
  openRunFactory(deps)(openCommand)(
    raw('open', { pipelineRef: 'demo-factory', params: ['topic=cats'], ...fields }),
  );

const run =
  (deps: RecordDeps) =>
  (command: RunCommand | ShowCommand, fields: Partial<CommandInput> = {}): Result<unknown> =>
    runCommandFactory(deps)(command)(raw(command.name, fields));

describe('open (use case)', () => {
  it('writes a state.json that matches the schema, paths relative to the repository', () => {
    const fileSystem = disk();
    expect(open(depsWith(fileSystem))).toMatchObject({
      ok: true,
      value: { pipelineFile: 'factories/demo-factory/pipeline.json', stateFile: STATE },
    });
    const written: unknown = JSON.parse(fileSystem.files.get(STATE)!);
    expect(stateSchema.safeParse(written).success).toBe(true);
    expect(written).toMatchObject({ $schema: 'factories/state.schema.json' });
  });

  it('refuses a second open, an unknown pipeline and a bad --param, writing nothing', () => {
    const fileSystem = disk();
    open(depsWith(fileSystem));
    expect(open(depsWith(fileSystem))).toMatchObject({
      ok: false,
      refusal: { guard: 'run-not-open' },
    });
    const fresh = disk();
    expect(open(depsWith(fresh), { pipelineRef: 'ghost' })).toMatchObject({
      ok: false,
      refusal: { guard: 'pipeline-found' },
    });
    expect(open(depsWith(fresh), { params: ['nope=1'] })).toMatchObject({
      ok: false,
      refusal: { guard: 'param-known' },
    });
    expect(open(depsWith(fresh), { runDir: undefined })).toMatchObject({
      ok: false,
      refusal: { guard: 'run-dir-given' },
    });
    expect(fresh.writes).toEqual([]);
  });

  it('finds a local factory first and records its path', () => {
    const local = 'factories.local/demo-factory/pipeline.json';
    const fileSystem = memoryFileSystem({
      [PIPELINE_FILE]: JSON.stringify(demoPipeline()),
      [`/repo/${local}`]: JSON.stringify(demoPipeline()),
    });
    expect(open(depsWith(fileSystem))).toMatchObject({
      ok: true,
      value: { pipelineFile: local },
    });
    expect(JSON.parse(fileSystem.files.get(STATE)!)).toMatchObject({ pipelineFile: local });
  });

  it('refuses a pipeline that fails the Zod shape', () => {
    const broken = memoryFileSystem({ [PIPELINE_FILE]: JSON.stringify({ id: 'demo-factory' }) });
    expect(open(depsWith(broken))).toMatchObject({
      ok: false,
      refusal: { guard: 'pipeline-file-valid' },
    });
  });
});

describe('commands on an open run (use case)', () => {
  it('reads, runs, writes; a refusal writes nothing', () => {
    const fileSystem = disk();
    const deps: RecordDeps = depsWith(fileSystem);
    open(deps);
    expect(run(deps)(startCommand)).toEqual({
      ok: true,
      value: { status: 'RUNNING', ready: ['draft'] },
    });
    const before: string = fileSystem.files.get(STATE)!;
    const writes: number = fileSystem.writes.length;
    expect(run(deps)(startCommand)).toMatchObject({ ok: false, refusal: { guard: 'run-is-idle' } });
    expect(run(deps)(stepDoneCommand, { step: 'draft' })).toMatchObject({
      ok: false,
      refusal: { guard: 'event-given' },
    });
    expect(fileSystem.files.get(STATE)).toBe(before);
    expect(fileSystem.writes.length).toBe(writes);
  });

  it('a new process never stamps earlier than the file holds', () => {
    const fileSystem = disk();
    const deps: RecordDeps = depsWith(fileSystem);
    open(deps);
    run(deps)(startCommand);
    run(deps)(startStepCommand, { step: 'draft' });
    const history = JSON.parse(fileSystem.files.get(STATE)!).history as { timestamp: string }[];
    expect(history.map((entry) => entry.timestamp)).toEqual([
      '2026-10-07T12:00:00Z',
      '2026-10-07T12:00:00.001Z',
      '2026-10-07T12:00:00.002Z',
    ]);
  });

  it("reads the run's pipeline.json snapshot before the factory's file", () => {
    const fileSystem = disk();
    const deps: RecordDeps = depsWith(fileSystem);
    open(deps);
    const snapshot: Pipeline = demoPipeline();
    snapshot.START = ['polish'];
    fileSystem.files.set(`${RUN}/pipeline.json`, JSON.stringify(snapshot));
    expect(run(deps)(startCommand)).toEqual({
      ok: true,
      value: { status: 'RUNNING', ready: ['polish'] },
    });
  });

  it('refuses a missing or broken state.json; show needs no pipeline', () => {
    const fileSystem = disk();
    const deps: RecordDeps = depsWith(fileSystem);
    expect(run(deps)(showCommand)).toMatchObject({
      ok: false,
      refusal: {
        guard: 'state-file-exists',
        message: `no state.json in ${RUN}: open the run first`,
      },
    });
    open(deps);
    fileSystem.files.delete(PIPELINE_FILE);
    expect(run(deps)(showCommand)).toMatchObject({ ok: true });
    expect(run(deps)(finishCommand)).toMatchObject({
      ok: false,
      refusal: { guard: 'pipeline-file-exists' },
    });
    fileSystem.files.set(STATE, '{ not json');
    expect(run(deps)(showCommand)).toMatchObject({
      ok: false,
      refusal: { guard: 'state-file-valid' },
    });
    const state = JSON.parse(serializeStateOf(fileSystem));
    fileSystem.files.set(STATE, JSON.stringify({ ...state, surprise: true }));
    expect(run(deps)(showCommand)).toMatchObject({
      ok: false,
      refusal: { guard: 'state-file-valid', message: expect.stringContaining('surprise') },
    });
  });
});

/** A valid state.json text, rebuilt from scratch on a fresh disk. */
const serializeStateOf = (fileSystem: ReturnType<typeof memoryFileSystem>): string => {
  const fresh = disk();
  open(depsWith(fresh));
  void fileSystem;
  return serializeState(JSON.parse(fresh.files.get(STATE)!));
};
