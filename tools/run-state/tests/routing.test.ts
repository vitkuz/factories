import { describe, expect, it } from 'vitest';
import { layersOf } from '../src/features/pipeline/graph.utils.js';
import type { Pipeline } from '../src/features/pipeline/pipeline.types.js';
import {
  lookupIn,
  readinessOf,
  resolveEdge,
  skipStranded,
  slugOf,
  strandedSteps,
} from '../src/features/routing/index.js';
import type { ConditionScopes } from '../src/features/routing/index.js';
import type { State } from '../src/features/state/index.js';
import { demoPipeline, fanPipeline, fixedClock, openState } from './helpers.js';

const scopes = (vars: Record<string, unknown> = {}): ConditionScopes => ({
  vars,
  params: { topic: 'cats', level: 2 },
  constants: { tone: 'plain', level: 'constant' },
  builtIns: { id: 'demo-factory', date: '2026-10-07', slug: 'my-topic', tone: 'built-in' },
});

const withConditions = (): Pipeline => {
  const pipeline: Pipeline = demoPipeline();
  pipeline.steps['review']!.transitions = {
    APPROVE: { target: ['END'], condition: 'score >= 8' },
    REVISE: { target: ['draft'], max: 1, onMax: ['polish'] },
    STUCK: { target: ['draft'], max: 1 },
  };
  pipeline.steps['polish']!.transitions = { DONE: { target: ['END'], condition: 'level > 5' } };
  return pipeline;
};

describe('lookupIn', () => {
  it('takes reported values first, then params, constants, built-ins', () => {
    const lookup = lookupIn(scopes({ level: 9 }));
    expect(lookup('level')).toEqual({ ok: true, value: 9 });
    expect(lookupIn(scopes())('level')).toEqual({ ok: true, value: 2 });
    expect(lookupIn(scopes())('tone')).toEqual({ ok: true, value: 'plain' });
    expect(lookupIn(scopes())('slug')).toEqual({ ok: true, value: 'my-topic' });
  });

  it('refuses an unknown name, prototype names included', () => {
    expect(lookupIn(scopes())('toString')).toEqual({
      ok: false,
      error:
        'condition uses "toString", which no step reported and is no param, constant or built-in',
    });
  });

  it('slug drops the date suffix of the run folder', () => {
    expect(slugOf('/r/my-topic-2026-10-07')).toBe('my-topic');
    expect(slugOf('/r/plain')).toBe('plain');
  });
});

describe('resolveEdge', () => {
  const route = (vars: Record<string, unknown>, counts: Record<string, number> = {}) =>
    resolveEdge(withConditions())(lookupIn(scopes(vars)), counts);

  it('takes the edge when its condition holds', () => {
    expect(route({ score: 9 })('review', 'APPROVE')).toEqual({
      ok: true,
      value: { key: 'review:APPROVE', taken: 'APPROVE', targets: ['END'], capped: false },
    });
  });

  it('falls back to the first unconditional edge when the condition is false', () => {
    expect(route({ score: 3 })('review', 'APPROVE')).toEqual({
      ok: true,
      value: { key: 'review:REVISE', taken: 'REVISE', targets: ['draft'], capped: false },
    });
  });

  it('takes onMax once the max is spent', () => {
    expect(route({}, { 'review:REVISE': 1 })('review', 'REVISE')).toEqual({
      ok: true,
      value: { key: 'review:REVISE', taken: 'REVISE', targets: ['polish'], capped: true, max: 1 },
    });
  });

  it('names each way it can fail', () => {
    expect(route({})('review', 'NOPE')).toMatchObject({ ok: false, reason: 'unknown-event' });
    expect(route({})('review', 'APPROVE')).toMatchObject({ ok: false, reason: 'bad-condition' });
    expect(route({})('polish', 'DONE')).toMatchObject({
      ok: false,
      reason: 'no-fallback',
      error:
        'the condition "level > 5" on polish:DONE is false and "polish" has no unconditional edge',
    });
    expect(route({}, { 'review:STUCK': 1 })('review', 'STUCK')).toMatchObject({
      ok: false,
      reason: 'cap-spent',
      error: 'edge review:STUCK was taken 1 time(s), its max, and has no onMax: the run stops here',
    });
  });
});

describe('readinessOf', () => {
  const fan: Pipeline = fanPipeline();
  const live = (activeSteps: string[], frontier: string[]): State => ({
    ...openState(fan),
    status: 'RUNNING',
    activeSteps,
    frontier,
  });

  it('a routed step nothing live can reach is ready', () => {
    expect(readinessOf(fan)(live([], ['left', 'right']))).toEqual({
      ready: ['left', 'right'],
      running: [],
      waiting: {},
    });
  });

  it('a fan-in waits for every live branch that can still reach it', () => {
    expect(readinessOf(fan)(live(['right'], ['join']))).toEqual({
      ready: [],
      running: ['right'],
      waiting: { join: ['right'] },
    });
  });

  it('a retry loop (an edge with max) does not make a step wait', () => {
    const demo: Pipeline = demoPipeline();
    const state: State = {
      ...openState(demo),
      status: 'RUNNING',
      activeSteps: ['review'],
      frontier: ['draft'],
    };
    expect(readinessOf(demo)(state).ready).toEqual(['draft']);
  });
});

describe('skipStranded', () => {
  it('closes never-started steps nothing live can reach, with the route as the reason', () => {
    const fan: Pipeline = fanPipeline();
    const state: State = { ...openState(fan), status: 'RUNNING', frontier: ['left'] };
    state.steps['split'] = { ...state.steps['split']!, status: 'COMPLETED', passes: 1 };
    expect(strandedSteps(fan)(state)).toEqual(['right']);
    const after: State = skipStranded(fan, fixedClock(state.updatedAt))('split returned LEFT')(
      state,
    );
    expect(after.steps['right']).toMatchObject({
      status: 'SKIPPED',
      skipReason: 'split returned LEFT and nothing routes here any more',
    });
    expect(after.history?.at(-1)).toMatchObject({
      type: 'STEP_SKIP',
      step: 'right',
      details: {
        reason: 'split returned LEFT and nothing routes here any more',
        unreachable: true,
      },
    });
  });
});

describe('layersOf', () => {
  it('numbers steps breadth first from START; unreachable steps have none', () => {
    const pipeline: Pipeline = demoPipeline();
    pipeline.steps['island'] = {
      agent: 'x',
      prompt: ['p'],
      transitions: { DONE: { target: ['END'] } },
    };
    expect(layersOf(pipeline)).toEqual({ draft: 1, review: 2, polish: 3, ask: 3 });
  });
});
