import { describe, expect, it } from 'vitest';
import { validatePipelineFactory } from '../src/features/validate/index.js';
import type { ValidationReport } from '../src/features/validate/index.js';
import { toJson } from '../src/features/report/index.js';
import { FILE, HEALTHY_DISK, ROOT, basePipeline, memoryFileSystem } from './helpers.js';

const validate = (document: unknown): ValidationReport =>
  validatePipelineFactory(memoryFileSystem(HEALTHY_DISK, { [FILE]: JSON.stringify(document) }))({
    rootPath: ROOT,
    cwd: ROOT,
    homePath: '/home/me',
  })(FILE);

const errorsOf = (document: unknown): string[] => toJson(validate(document)).errors;

describe('validate: read → shape → rules', () => {
  it('passes a healthy pipeline', () => {
    const report: ValidationReport = validate(basePipeline());
    expect(report).toMatchObject({ ok: true, rulesRan: true, findings: [] });
  });

  it('reports an unreadable file and runs no rules', () => {
    const report: ValidationReport = validatePipelineFactory(
      memoryFileSystem(HEALTHY_DISK, { [FILE]: '{bad' }),
    )({
      rootPath: ROOT,
      cwd: ROOT,
      homePath: '/home/me',
    })(FILE);
    expect(report.ok).toBe(false);
    expect(report.rulesRan).toBe(false);
    expect(toJson(report).errors[0]).toMatch(
      /^cannot read \/repo\/factories\/demo-factory\/pipeline.json: /,
    );
  });

  it('stops at the shape and skips the graph rules', () => {
    const report: ValidationReport = validate({
      ...basePipeline(),
      START: ['ghost'],
      outputDir: 3,
    });
    expect(report.rulesRan).toBe(false);
    expect(toJson(report).errors).toEqual([
      'schema: pipeline.outputDir: must be string, got integer',
    ]);
  });
});

describe('shape messages (the text factory-diagram matches on)', () => {
  it('names a missing key at its parent', () => {
    const { id: _id, ...rest } = basePipeline();
    expect(errorsOf(rest)).toEqual(['schema: pipeline: missing required "id"']);
  });

  it('says what type it wanted and got', () => {
    const pipeline = basePipeline();
    expect(
      errorsOf({
        ...pipeline,
        steps: {
          ...pipeline.steps,
          draft: { ...pipeline.steps['draft'], prompt: 'hi', systemPrompt: 'x' },
        },
      }),
    ).toEqual([
      'schema: pipeline.steps.draft.prompt: must be array, got string',
      'schema: pipeline.steps.draft: unexpected key "systemPrompt"',
    ]);
  });

  it('checks enums, integers, anchors and the onMax/max pair', () => {
    const pipeline = basePipeline();
    const errors: string[] = errorsOf({
      ...pipeline,
      constants: { ...pipeline.constants, rootPath: '/abs' },
      steps: {
        ...pipeline.steps,
        review: {
          ...pipeline.steps['review'],
          model: 'gpt',
          transitions: {
            APPROVE: { target: ['END'], onMax: ['END'] },
            REVISE: { target: ['draft'], max: 1.5 },
          },
        },
      },
    });
    expect(errors).toEqual(
      expect.arrayContaining([
        'schema: pipeline.constants.rootPath: must be "cwd"',
        'schema: pipeline.steps.review.model: must be one of "fable", "opus", "sonnet", "haiku"',
        'schema: pipeline.steps.review.transitions.APPROVE: "onMax" needs "max"',
        'schema: pipeline.steps.review.transitions.REVISE.max: must be integer, got number',
      ]),
    );
  });

  it('names a bad key', () => {
    const pipeline = basePipeline();
    expect(
      errorsOf({ ...pipeline, steps: { ...pipeline.steps, Bad: pipeline.steps['draft'] } }),
    ).toEqual([
      'schema: pipeline.steps.<key Bad>: a step name must be kebab-case and start with a letter',
    ]);
  });
});
