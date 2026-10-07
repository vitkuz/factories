import { describe, expect, it } from 'vitest';
import {
  COMMANDS,
  execute,
  failCommand,
  finishCommand,
  humanCommand,
  openCommand,
  readyCommand,
  showCommand,
  skipCommand,
  startCommand,
  startStepCommand,
  stepDoneCommand,
} from '../src/features/commands/index.js';
import type { Pipeline } from '../src/features/pipeline/pipeline.types.js';
import type { HistoryEntry, State } from '../src/features/state/index.js';
import { normalizeState } from '../src/features/state/index.js';
import { flow } from '../src/shared/utils/fp.utils.js';
import { parseNanos } from '../src/clients/clock/index.js';
import {
  RUN_DIR,
  demoPipeline,
  fanPipeline,
  openContext,
  openState,
  outputOf,
  refusalOf,
  runContext,
  stateOf,
  step,
} from './helpers.js';

const demo: Pipeline = demoPipeline();
const on = step(demo);
const started: State = on(startCommand)(openState());
const types = (state: State): string[] =>
  (state.history ?? []).map((entry: HistoryEntry) => entry.type);

/** draft DONE → review started: the state just before review returns. */
const atReview: State = flow<State>(
  on(startStepCommand, { step: 'draft' }),
  on(stepDoneCommand, { step: 'draft', event: 'DONE' }),
  on(startStepCommand, { step: 'review' }),
)(started);

describe('the registry', () => {
  it('has every command once, in help order', () => {
    expect(COMMANDS.map((command) => command.name)).toEqual([
      'open',
      'start',
      'start-step',
      'step-done',
      'human',
      'fail',
      'skip',
      'ready',
      'show',
      'finish',
    ]);
  });

  it('guard ids are kebab-case and unique within each command', () => {
    COMMANDS.forEach((command) => {
      const ids: string[] = [...command.inputGuards, ...command.guards].map((guard) => guard.id);
      expect(new Set(ids).size).toBe(ids.length);
      ids.forEach((id) => expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/));
    });
  });
});

describe('open', () => {
  it('builds an IDLE run: params coerced to their defaults’ types, a step record per step', () => {
    const result = execute(openCommand)(
      openContext(demo, { params: ['topic=cats', 'count=5', 'strict=yes'] }),
    );
    expect(outputOf(result)).toEqual({
      runId: 'run-20261007T120000-abcdef',
      pipeline: 'demo-factory',
      pipelineFile: 'factories/demo-factory/pipeline.json',
      stateFile: `${RUN_DIR}/state.json`,
      params: { topic: 'cats', count: 5, strict: true },
      start: ['draft'],
    });
    expect(normalizeState(stateOf(result))).toEqual({
      $schema: 'factories/state.schema.json',
      runId: 'run-20261007T120000-abcdef',
      pipelineName: 'demo-factory',
      pipelineFile: 'factories/demo-factory/pipeline.json',
      status: 'IDLE',
      createdAt: '2026-10-07T12:00:00Z',
      updatedAt: '2026-10-07T12:00:00Z',
      currentWave: 1,
      activeSteps: [],
      context: {
        constants: { rootPath: 'cwd', skillPath: '.', homePath: '~', tone: 'plain' },
        params: { topic: 'cats', count: 5, strict: true },
        captured: {},
      },
      steps: {
        ask: { order: 3, kind: 'agent', agent: 'human', status: 'PENDING', retryCount: 0 },
        draft: {
          order: 1,
          kind: 'agent',
          agent: 'general-purpose',
          status: 'PENDING',
          retryCount: 0,
        },
        polish: {
          order: 3,
          kind: 'agent',
          agent: 'general-purpose',
          status: 'PENDING',
          retryCount: 0,
        },
        review: {
          order: 2,
          kind: 'agent',
          agent: 'general-purpose',
          status: 'PENDING',
          retryCount: 0,
        },
      },
      history: [
        {
          timestamp: '2026-10-07T12:00:00Z',
          type: 'PIPELINE_INIT',
          message: "Pipeline 'demo-factory' initialized with runId 'run-20261007T120000-abcdef'.",
          details: {
            fromStep: '',
            runId: 'run-20261007T120000-abcdef',
            sessionId: 'session-1',
            sessionSource: '',
            start: ['draft'],
            transcriptPath: '',
          },
        },
      ],
      mode: 'graph',
      edges: {},
    });
  });
});

describe('start', () => {
  it('sets RUNNING, routes to START and says what is ready', () => {
    const result = execute(startCommand)(runContext(openState(), demo, 'start'));
    expect(outputOf(result)).toEqual({ status: 'RUNNING', ready: ['draft'] });
    expect(stateOf(result)).toMatchObject({ status: 'RUNNING', frontier: ['draft'] });
    expect(stateOf(result).history?.at(-1)).toEqual({
      timestamp: '2026-10-07T12:00:00.001Z',
      type: 'WAVE_START',
      message: 'Pipeline started at wave 1.',
    });
  });
});

describe('start-step', () => {
  it('starts a pass: RUNNING, active, off the frontier', () => {
    const result = execute(startStepCommand)(
      runContext(started, demo, 'start-step', { step: 'draft' }),
    );
    expect(outputOf(result)).toEqual({ step: 'draft', pass: 1 });
    expect(stateOf(result)).toMatchObject({ activeSteps: ['draft'], frontier: [] });
    expect(stateOf(result).steps['draft']).toMatchObject({ status: 'RUNNING', passes: 1 });
    expect(stateOf(result).history?.at(-1)).toMatchObject({ type: 'STEP_START', step: 'draft' });
  });

  it('a second pass clears what the first left and records the pass number', () => {
    const again: State = flow<State>(
      on(stepDoneCommand, {
        step: 'review',
        event: 'REVISE',
        note: 'tighten',
        reports: ['score=3'],
      }),
      on(startStepCommand, { step: 'draft' }),
    )(atReview);
    expect(again.steps['draft']).toEqual(
      expect.objectContaining({ status: 'RUNNING', passes: 2, order: 1 }),
    );
    expect(again.steps['draft']).not.toHaveProperty('event');
    expect(again.steps['draft']).not.toHaveProperty('completedAt');
    expect(again.history?.at(-1)).toMatchObject({ type: 'STEP_START', details: { pass: 2 } });
  });
});

describe('step-done', () => {
  it('records the event, counts the edge, routes to the targets', () => {
    const result = execute(stepDoneCommand)(
      runContext(atReview, demo, 'step-done', {
        step: 'review',
        event: 'REVISE',
        outputs: ['2-review/feedback.md', `${RUN_DIR}/2-review/abs.md`],
        reports: ['score=3', 'ok=false'],
        note: 'tighten',
      }),
    );
    expect(outputOf(result)).toEqual({
      step: 'review',
      event: 'REVISE',
      targets: ['draft'],
      capped: false,
      ready: ['draft'],
      waiting: {},
      running: [],
      skipped: [],
      finished: false,
    });
    const state: State = stateOf(result);
    expect(state.edges).toEqual({ 'draft:DONE': 1, 'review:REVISE': 1 });
    expect(state.vars).toEqual({ score: 3, ok: false });
    expect(state.steps['review']).toMatchObject({
      status: 'COMPLETED',
      event: 'REVISE',
      outputs: ['2-review/feedback.md', '2-review/abs.md'],
      reported: { score: 3, ok: false },
      note: 'tighten',
    });
    expect(state.history?.at(-1)).toMatchObject({
      type: 'STEP_EVENT',
      message: 'Step "review" returned "REVISE" -> [draft].',
      details: {
        event: 'REVISE',
        targets: ['draft'],
        note: 'tighten',
        reported: { score: 3, ok: false },
      },
    });
  });

  it('once the max is spent it takes onMax, notes EDGE_CAPPED and does not count the edge', () => {
    const loop = (state: State): State =>
      flow<State>(
        on(stepDoneCommand, { step: 'review', event: 'REVISE' }),
        on(startStepCommand, { step: 'draft' }),
        on(stepDoneCommand, { step: 'draft', event: 'DONE' }),
        on(startStepCommand, { step: 'review' }),
      )(state);
    const third: State = loop(loop(atReview));
    const result = execute(stepDoneCommand)(
      runContext(third, demo, 'step-done', { step: 'review', event: 'REVISE' }),
    );
    expect(outputOf(result)).toMatchObject({
      targets: ['polish'],
      capped: true,
      ready: ['polish'],
    });
    const state: State = stateOf(result);
    expect(state.edges?.['review:REVISE']).toBe(2);
    expect(types(state).slice(-3)).toEqual(['EDGE_CAPPED', 'STEP_EVENT', 'STEP_SKIP']);
    expect(state.history?.at(-3)).toMatchObject({
      message: 'Edge "review:REVISE" reached its max of 2; taking onMax -> [polish].',
      details: { edge: 'review:REVISE', max: 2, targets: ['polish'] },
    });
    expect(state.history?.at(-3)?.timestamp).toBe(state.steps['review']?.completedAt);
  });

  it('an event to END with nothing live finishes, and strands what is left', () => {
    const result = execute(stepDoneCommand)(
      runContext(atReview, demo, 'step-done', { step: 'review', event: 'APPROVE' }),
    );
    expect(outputOf(result)).toMatchObject({
      targets: ['END'],
      finished: true,
      skipped: ['ask', 'polish'],
    });
    expect(types(stateOf(result)).slice(-3)).toEqual(['STEP_EVENT', 'STEP_SKIP', 'STEP_SKIP']);
  });
});

describe('human', () => {
  const atAsk: State = flow<State>(
    on(stepDoneCommand, { step: 'review', event: 'ASK' }),
    on(startStepCommand, { step: 'ask' }),
  )(atReview);

  it("records the answer; outputs default to the step's declared output", () => {
    const result = execute(humanCommand)(
      runContext(atAsk, demo, 'human', { step: 'ask', event: 'NO', note: 'shorter' }),
    );
    expect(outputOf(result)).toMatchObject({ step: 'ask', event: 'NO', targets: ['draft'] });
    expect(stateOf(result).steps['ask']).toMatchObject({
      outputs: ['4-ask/decision.md'],
      note: 'shorter',
    });
    expect(stateOf(result).history?.at(-1)).toMatchObject({
      type: 'HUMAN_ANSWER',
      message: 'Human answered "NO" at "ask" -> [draft].',
    });
  });

  it('refuses an agent step, and step-done refuses a human step', () => {
    expect(
      refusalOf(
        execute(humanCommand)(
          runContext(atReview, demo, 'human', { step: 'review', event: 'ASK' }),
        ),
      ),
    ).toEqual({
      guard: 'step-is-human',
      message: 'step "review" is not a human step: use step-done',
    });
    expect(
      refusalOf(
        execute(stepDoneCommand)(
          runContext(atAsk, demo, 'step-done', { step: 'ask', event: 'YES' }),
        ),
      ),
    ).toEqual({
      guard: 'step-is-agent',
      message: 'step "ask" is a human step: use human',
    });
  });
});

describe('fail', () => {
  it('fails the step and the run', () => {
    const result = execute(failCommand)(
      runContext(atReview, demo, 'fail', { step: 'review', error: 'crashed' }),
    );
    expect(outputOf(result)).toEqual({ step: 'review', status: 'FAILED' });
    expect(stateOf(result).steps['review']).toMatchObject({ status: 'FAILED', error: 'crashed' });
    expect(stateOf(result).activeSteps).toEqual([]);
    expect(types(stateOf(result)).slice(-2)).toEqual(['STEP_FAIL', 'PIPELINE_FAIL']);
  });
});

describe('skip', () => {
  it('skips a pending step and closes what only it led to', () => {
    const fan: Pipeline = fanPipeline();
    const atBranches: State = flow<State>(
      step(fan)(startCommand),
      step(fan)(startStepCommand, { step: 'split' }),
      step(fan)(stepDoneCommand, { step: 'split', event: 'BOTH' }),
    )(openState(fan));
    const result = execute(skipCommand)(
      runContext(atBranches, fan, 'skip', { step: 'right', reason: 'not needed' }),
    );
    expect(outputOf(result)).toEqual({ step: 'right', ready: ['left'], running: [], waiting: {} });
    expect(stateOf(result).steps['right']).toMatchObject({
      status: 'SKIPPED',
      skipReason: 'not needed',
    });
    expect(stateOf(result).history?.at(-1)).toMatchObject({
      details: { reason: 'not needed', unreachable: false },
    });
  });
});

describe('ready and show', () => {
  it('ready writes nothing and says what may start', () => {
    const result = execute(readyCommand)(runContext(started, demo, 'ready'));
    expect(result).toEqual({
      ok: true,
      value: {
        output: { status: 'RUNNING', ready: ['draft'], running: [], waiting: {}, done: false },
      },
    });
  });

  it('show prints the written form and writes nothing', () => {
    const result = execute(showCommand)({ state: started });
    expect(result).toEqual({ ok: true, value: { output: normalizeState(started) } });
  });
});

describe('finish', () => {
  it('skips every untouched step and completes the run', () => {
    const done: State = on(stepDoneCommand, { step: 'review', event: 'APPROVE' })(atReview);
    const result = execute(finishCommand)(runContext(done, demo, 'finish'));
    expect(outputOf(result)).toEqual({ status: 'COMPLETED', pipeline: 'demo-factory' });
    expect(types(stateOf(result)).at(-1)).toBe('PIPELINE_COMPLETE');
  });

  it('refuses while a step runs or a routed step has not run', () => {
    expect(refusalOf(execute(finishCommand)(runContext(atReview, demo, 'finish'))).guard).toBe(
      'nothing-running-on-finish',
    );
    expect(refusalOf(execute(finishCommand)(runContext(started, demo, 'finish')))).toEqual({
      guard: 'nothing-routed-on-finish',
      message: 'step(s) routed to but not run: draft (run them or skip them)',
    });
  });
});

describe('timestamps', () => {
  it('every history entry is strictly later than the one before', () => {
    const done: State = flow<State>(
      on(stepDoneCommand, { step: 'review', event: 'APPROVE' }),
      on(finishCommand),
    )(atReview);
    const stamps: bigint[] = (done.history ?? []).map((entry: HistoryEntry) =>
      parseNanos(entry.timestamp)!,
    );
    stamps
      .slice(1)
      .forEach((stamp: bigint, index: number) => expect(stamp > stamps[index]!).toBe(true));
  });
});
