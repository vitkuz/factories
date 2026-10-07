import { describe, expect, it } from 'vitest';
import { startCommand, startStepCommand, stepDoneCommand } from '../src/features/commands/index.js';
import type { CommandInput, OpenContext, RunContext } from '../src/features/commands/index.js';
import * as guards from '../src/features/guards/index.js';
import type { Guard } from '../src/features/guards/index.js';
import type { Pipeline } from '../src/features/pipeline/pipeline.types.js';
import type { State } from '../src/features/state/index.js';
import { flow } from '../src/shared/utils/fp.utils.js';
import {
  demoPipeline,
  fanPipeline,
  inputFor,
  openContext,
  openState,
  runContext,
  step,
} from './helpers.js';

const demo: Pipeline = demoPipeline();
const on = step(demo);
const opened: State = openState();
const started: State = on(startCommand)(opened);
const drafting: State = on(startStepCommand, { step: 'draft' })(started);
const atReview: State = flow<State>(
  on(stepDoneCommand, { step: 'draft', event: 'DONE' }),
  on(startStepCommand, { step: 'review' }),
)(drafting);

/** The message a guard refuses with, or undefined when it lets the command go. */
const check =
  <Context>(guard: Guard<Context>) =>
  (context: Context): string | undefined => {
    const refusal = guard.check(context);
    if (refusal !== undefined) expect(refusal.guard).toBe(guard.id);
    return refusal?.message;
  };

const input = (fields: Partial<CommandInput>): CommandInput => ({ ...inputFor('x'), ...fields });
const at = (
  state: State,
  fields: Partial<CommandInput> = {},
  pipeline: Pipeline = demo,
): RunContext => runContext(state, pipeline, fields.command ?? 'x', fields);
const opening = (params: string[]): OpenContext => openContext(demo, { params });

describe('argument guards (before any file is read)', () => {
  it('run-dir-given', () => {
    expect(check(guards.runDirGiven)(input({}))).toBeUndefined();
    expect(check(guards.runDirGiven)(input({ command: 'open', runDir: undefined }))).toBe(
      'open needs <id | pipeline.json> <runDir>',
    );
    expect(check(guards.runDirGiven)(input({ command: 'start', runDir: undefined }))).toBe(
      'name the run folder: start <runDir> …',
    );
  });

  it('event-given', () => {
    expect(check(guards.eventGiven)(input({ event: 'DONE' }))).toBeUndefined();
    expect(check(guards.eventGiven)(input({ command: 'human' }))).toBe(
      'human needs <step> <EVENT>',
    );
  });

  it('error-given', () => {
    expect(check(guards.errorGiven)(input({ error: 'boom' }))).toBeUndefined();
    expect(check(guards.errorGiven)(input({ error: '' }))).toBe(
      'fail needs --error "<what went wrong>"',
    );
  });

  it('reason-given', () => {
    expect(check(guards.reasonGiven)(input({ reason: 'why' }))).toBeUndefined();
    expect(check(guards.reasonGiven)(input({}))).toBe(
      'skip needs --reason "<why it will not run>"',
    );
  });
});

describe('open guards', () => {
  it('params-are-pairs', () => {
    expect(check(guards.paramsArePairs)(opening(['topic=a=b']))).toBeUndefined();
    expect(check(guards.paramsArePairs)(opening(['=x']))).toBe(
      '--param takes name=value, got "=x"',
    );
  });

  it('param-known', () => {
    expect(check(guards.paramKnown)(opening(['topic=a', 'count=2']))).toBeUndefined();
    expect(check(guards.paramKnown)(opening(['topic=a', 'colour=red']))).toBe(
      'unknown param(s): colour — demo-factory declares topic, count, strict',
    );
  });

  it('param-fits-type', () => {
    expect(check(guards.paramFitsType)(opening(['count=7', 'strict=no']))).toBeUndefined();
    expect(check(guards.paramFitsType)(opening(['count=lots']))).toBe(
      '--param count: "lots" is not a number',
    );
    expect(check(guards.paramFitsType)(opening(['count=2.5']))).toBe(
      '--param count: "2.5" is not a whole number',
    );
    expect(check(guards.paramFitsType)(opening(['strict=maybe']))).toBe(
      '--param strict: "maybe" is not a boolean',
    );
  });

  it('param-has-value', () => {
    expect(check(guards.paramHasValue)(opening(['topic=cats']))).toBeUndefined();
    expect(check(guards.paramHasValue)(opening([]))).toBe(
      'param(s) with no default and no value: topic (ask the user, then pass --param name=value)',
    );
  });
});

describe('run guards', () => {
  it('run-is-idle', () => {
    expect(check(guards.runIsIdle)(at(opened))).toBeUndefined();
    expect(check(guards.runIsIdle)(at(started))).toBe(
      'the run is RUNNING, not IDLE: it was started already',
    );
  });

  it('run-is-running', () => {
    expect(check(guards.runIsRunning)(at(started))).toBeUndefined();
    expect(check(guards.runIsRunning)(at(opened))).toBe('the run is IDLE, not RUNNING');
  });

  it('step-is-named', () => {
    expect(check(guards.stepIsNamed)(at(started, { step: 'draft' }))).toBeUndefined();
    expect(check(guards.stepIsNamed)(at(started))).toBe('name the step');
  });

  it('step-is-known', () => {
    expect(check(guards.stepIsKnown)(at(started, { step: 'draft' }))).toBeUndefined();
    expect(check(guards.stepIsKnown)(at(started, { step: 'ghost' }))).toBe(
      '"ghost" is not a step of demo-factory: expected one of draft, review, polish, ask',
    );
  });

  it('step-not-running', () => {
    expect(check(guards.stepNotRunning)(at(started, { step: 'draft' }))).toBeUndefined();
    expect(check(guards.stepNotRunning)(at(drafting, { step: 'draft' }))).toBe(
      'step "draft" is already running',
    );
  });

  it('step-is-routed', () => {
    expect(check(guards.stepIsRouted)(at(started, { step: 'draft' }))).toBeUndefined();
    expect(check(guards.stepIsRouted)(at(started, { step: 'review' }))).toBe(
      'step "review" is not routed to: nothing sent the run there',
    );
  });

  it('fan-in-ready', () => {
    const fan: Pipeline = fanPipeline();
    const branches: State = flow<State>(
      step(fan)(startCommand),
      step(fan)(startStepCommand, { step: 'split' }),
      step(fan)(stepDoneCommand, { step: 'split', event: 'BOTH' }),
      step(fan)(startStepCommand, { step: 'left' }),
      step(fan)(startStepCommand, { step: 'right' }),
      step(fan)(stepDoneCommand, { step: 'left', event: 'DONE' }),
    )(openState(fan));
    expect(check(guards.fanInReady)(at(branches, { step: 'join' }, fan))).toBe(
      'step "join" waits for right (fan-in): start it when they are done',
    );
    const joined: State = step(fan)(stepDoneCommand, { step: 'right', event: 'DONE' })(branches);
    expect(check(guards.fanInReady)(at(joined, { step: 'join' }, fan))).toBeUndefined();
  });

  it('step-is-running', () => {
    expect(check(guards.stepIsRunning)(at(drafting, { step: 'draft' }))).toBeUndefined();
    expect(check(guards.stepIsRunning)(at(started, { step: 'draft' }))).toBe(
      'step "draft" is PENDING, not RUNNING: start it first',
    );
    expect(check(guards.stepIsRunning)(at(atReview, { step: 'draft' }))).toBe(
      'step "draft" is COMPLETED, not RUNNING',
    );
  });

  it('step-is-agent and step-is-human', () => {
    expect(check(guards.stepIsAgent)(at(started, { step: 'draft' }))).toBeUndefined();
    expect(check(guards.stepIsAgent)(at(started, { step: 'ask' }))).toBe(
      'step "ask" is a human step: use human',
    );
    expect(check(guards.stepIsHuman)(at(started, { step: 'ask' }))).toBeUndefined();
    expect(check(guards.stepIsHuman)(at(started, { step: 'draft' }))).toBe(
      'step "draft" is not a human step: use step-done',
    );
  });

  it('step-is-pending', () => {
    expect(check(guards.stepIsPending)(at(started, { step: 'polish' }))).toBeUndefined();
    expect(check(guards.stepIsPending)(at(drafting, { step: 'draft' }))).toBe(
      'step "draft" is RUNNING: only a PENDING step can be skipped',
    );
  });

  it('reports-are-pairs', () => {
    expect(check(guards.reportsArePairs)(at(atReview, { reports: ['a=1'] }))).toBeUndefined();
    expect(check(guards.reportsArePairs)(at(atReview, { reports: ['a=1', 'oops'] }))).toBe(
      '--report takes name=value, got "oops"',
    );
  });

  it('nothing-running-on-finish and nothing-routed-on-finish', () => {
    expect(check(guards.nothingRunningOnFinish)(at(drafting))).toBe('step(s) still running: draft');
    expect(check(guards.nothingRunningOnFinish)(at(started))).toBeUndefined();
    expect(check(guards.nothingRoutedOnFinish)(at(started))).toBe(
      'step(s) routed to but not run: draft (run them or skip them)',
    );
    expect(check(guards.nothingRoutedOnFinish)(at(drafting))).toBeUndefined();
  });
});

describe('routing guards: each refuses only its own way an event cannot be routed', () => {
  const conditional: Pipeline = demoPipeline();
  conditional.steps['review']!.transitions = {
    APPROVE: { target: ['END'], condition: 'score >= 8' },
    BROKEN: { target: ['END'], condition: 'score >' },
    STUCK: { target: ['draft'], max: 1 },
  };
  conditional.steps['draft']!.transitions = { DONE: { target: ['review'], condition: 'ready' } };
  const reviewing: State = { ...atReview, edges: { 'review:STUCK': 1 } };
  const ctx = (event: string, reports: string[] = [], name: string = 'review'): RunContext =>
    runContext(reviewing, conditional, 'step-done', { step: name, event, reports });
  const routing: Guard<RunContext>[] = [
    guards.eventIsKnown,
    guards.conditionIsValid,
    guards.fallbackExists,
    guards.capNotSpent,
  ];
  const refusedBy = (context: RunContext): string[] =>
    routing.filter((guard) => guard.check(context) !== undefined).map((guard) => guard.id);

  it('a routable event passes all four', () => {
    expect(refusedBy(ctx('APPROVE', ['score=9']))).toEqual([]);
    // false condition → the first unconditional edge (STUCK), whose cap is spent
    expect(refusedBy(ctx('APPROVE', ['score=1']))).toEqual(['cap-not-spent']);
  });

  it('event-is-known', () => {
    expect(check(guards.eventIsKnown)(ctx('NOPE'))).toBe(
      '"NOPE" is not an event of "review": expected one of APPROVE, BROKEN, STUCK',
    );
    expect(refusedBy(ctx('NOPE'))).toEqual(['event-is-known']);
  });

  it('condition-is-valid', () => {
    expect(check(guards.conditionIsValid)(ctx('BROKEN', ['score=1']))).toBe(
      'condition "score >" ends too early',
    );
    expect(check(guards.conditionIsValid)(ctx('APPROVE'))).toBe(
      'condition uses "score", which no step reported and is no param, constant or built-in',
    );
    expect(refusedBy(ctx('BROKEN', ['score=1']))).toEqual(['condition-is-valid']);
  });

  it('fallback-exists', () => {
    expect(check(guards.fallbackExists)(ctx('DONE', ['ready=false'], 'draft'))).toBe(
      'the condition "ready" on draft:DONE is false and "draft" has no unconditional edge',
    );
  });

  it('cap-not-spent', () => {
    expect(check(guards.capNotSpent)(ctx('STUCK'))).toBe(
      'edge review:STUCK was taken 1 time(s), its max, and has no onMax: the run stops here',
    );
    expect(refusedBy(ctx('STUCK'))).toEqual(['cap-not-spent']);
  });
});
