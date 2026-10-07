import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { createFileSystemClient } from '../src/clients/file-system/index.js';
import {
  finishCommand,
  humanCommand,
  openCommand,
  readyCommand,
  showCommand,
  startCommand,
  startStepCommand,
  stepDoneCommand,
} from '../src/features/commands/index.js';
import type {
  CommandInput,
  ReadyOutput,
  RunCommand,
  ShowCommand,
} from '../src/features/commands/index.js';
import type { EdgeEntry, Pipeline } from '../src/features/pipeline/pipeline.types.js';
import { edgesOf } from '../src/features/pipeline/pipeline.utils.js';
import {
  listPipelineIdsFactory,
  loadPipelineFactory,
  pipelineFileOfIdFactory,
} from '../src/features/pipeline/services/index.js';
import { openRunFactory, runCommandFactory } from '../src/features/record/index.js';
import type { RecordDeps } from '../src/features/record/index.js';
import type { State } from '../src/features/state/index.js';
import { stateSchema } from '../src/features/state/index.js';
import type { Result } from '../src/shared/types/result.types.js';
import { fixedClock, fixedRunId } from './helpers.js';
import { fixtureProject } from './kit.js';

const fileSystem = createFileSystemClient();
/** A project the way a consumer has it: `factories` links to the kit. */
const project = fixtureProject();
const ids: string[] = listPipelineIdsFactory(fileSystem)(project.root);
const scratch: string = mkdtempSync(path.join(os.tmpdir(), 'run-state-factories-'));
afterAll(() => {
  rmSync(scratch, { recursive: true, force: true });
  project.remove();
});

const deps: RecordDeps = {
  fileSystem,
  clockAfter: fixedClock,
  newRunId: fixedRunId,
  rootPath: project.root,
  cwd: project.root,
  sessionId: '',
  schemaFile: path.join(project.root, 'factories', 'state.schema.json'),
};

const valueOf = <T>(result: Result<unknown>): T => {
  if (!result.ok) throw new Error(`refused [${result.refusal.guard}]: ${result.refusal.message}`);
  return result.value as T;
};

/** The happy event of a step: the first edge without a max (a forward edge, so the walk ends). */
const happyEvent = (pipeline: Pipeline, name: string): string => {
  const [event]: EdgeEntry = edgesOf(pipeline.steps[name]).find(
    ([, edge]: EdgeEntry) => edge.max === undefined,
  )!;
  return event;
};

describe('every factory of the kit, from a project: open → start → a happy path → finish', () => {
  it('has factories to run', () => expect(ids.length).toBeGreaterThan(0));

  it.each(ids)('%s', (id: string) => {
    const loaded = loadPipelineFactory(fileSystem)(
      pipelineFileOfIdFactory(fileSystem)(project.root)(id),
    );
    if (!loaded.ok) throw new Error(loaded.refusal.message);
    const pipeline: Pipeline = loaded.value;
    const runDir: string = path.join(scratch, id, 'happy-2026-10-07');
    const input = (command: string, fields: Partial<CommandInput> = {}): CommandInput => ({
      command,
      runDir,
      outputs: [],
      reports: [],
      params: [],
      ...fields,
    });
    const run = (
      command: RunCommand | ShowCommand,
      fields: Partial<CommandInput> = {},
    ): Result<unknown> => runCommandFactory(deps)(command)(input(command.name, fields));

    const needed: string[] = Object.entries(pipeline.params ?? {})
      .filter(([, value]) => value === '')
      .map(([name]) => `${name}=test`);
    valueOf(openRunFactory(deps)(openCommand)(input('open', { pipelineRef: id, params: needed })));
    valueOf(run(startCommand));

    const walk = (guard: number): void => {
      const { ready }: ReadyOutput = valueOf<ReadyOutput>(run(readyCommand));
      const [next]: string[] = ready;
      if (next === undefined) return;
      expect(guard).toBeLessThan(200);
      valueOf(run(startStepCommand, { step: next }));
      const human: boolean = pipeline.steps[next]?.agent === 'human';
      valueOf(
        run(human ? humanCommand : stepDoneCommand, {
          step: next,
          event: happyEvent(pipeline, next),
        }),
      );
      walk(guard + 1);
    };
    walk(0);

    expect(valueOf(run(finishCommand))).toEqual({ status: 'COMPLETED', pipeline: id });
    const state: State = valueOf<State>(run(showCommand));
    expect(stateSchema.safeParse(state).success).toBe(true);
    expect(
      Object.values(state.steps).every((step) => ['COMPLETED', 'SKIPPED'].includes(step.status)),
    ).toBe(true);
  });
});
