import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { z } from 'zod';
import {
  HISTORY_TYPES,
  PAUSE_STATUSES,
  RUN_STATUSES,
  STEP_STATUSES,
  contextSchema,
  historyEntrySchema,
  pauseSchema,
  stateSchema,
  stepRecordSchema,
} from '../src/features/state/index.js';
import { KIT_ROOT } from './kit.js';

/**
 * state.schema.json (editors, other tools) and state.schema.ts (this recorder) describe one shape.
 * This fails when a key, a required key or an enum value is in one and not the other.
 */
interface JsonObjectSchema {
  required?: string[];
  additionalProperties?: unknown;
  properties: Record<
    string,
    { enum?: string[]; properties?: Record<string, unknown> } & JsonObjectSchema
  >;
}

const json = JSON.parse(
  readFileSync(path.join(KIT_ROOT, 'state.schema.json'), 'utf8'),
) as JsonObjectSchema & {
  $defs: Record<string, JsonObjectSchema>;
};
const stepRecord: JsonObjectSchema = json.$defs['stepRecord']!;
const history: JsonObjectSchema = json.$defs['historyEvent']!;

const keysOf = (shape: Record<string, z.ZodType>): { all: string[]; required: string[] } => ({
  all: Object.keys(shape).sort(),
  required: Object.entries(shape)
    .filter(([, field]) => !field.safeParse(undefined).success)
    .map(([key]) => key)
    .sort(),
});

const jsonKeysOf = (schema: JsonObjectSchema): { all: string[]; required: string[] } => ({
  all: Object.keys(schema.properties).sort(),
  required: [...(schema.required ?? [])].sort(),
});

describe('state.schema.ts mirrors state.schema.json', () => {
  it.each([
    ['state', stateSchema.shape, json],
    ['context', contextSchema.shape, json.properties['context']!],
    ['pause', pauseSchema.shape, json.properties['pause']!],
    ['stepRecord', stepRecordSchema.shape, stepRecord],
    ['childPipeline', null, stepRecord.properties['childPipeline']!],
    ['historyEvent', historyEntrySchema.shape, history],
  ] as const)('%s: same keys, same required keys, closed to others', (name, shape, schema) => {
    expect(schema.additionalProperties).toBe(false);
    if (shape !== null)
      expect(keysOf(shape as Record<string, z.ZodType>)).toEqual(jsonKeysOf(schema));
    else expect(name).toBe('childPipeline');
  });

  it('childPipeline: same keys (it is lazy, so checked by parsing)', () => {
    const keys: string[] = Object.keys(stepRecord.properties['childPipeline']!.properties ?? {});
    const full = Object.fromEntries(keys.map((key) => [key, key === 'path' ? 'p' : undefined]));
    expect(
      stepRecordSchema.safeParse({ order: 0, status: 'PENDING', childPipeline: full }).success,
    ).toBe(true);
    expect(
      stepRecordSchema.safeParse({
        order: 0,
        status: 'PENDING',
        childPipeline: { path: 'p', extra: 1 },
      }).success,
    ).toBe(false);
    expect(
      stepRecordSchema.safeParse({ order: 0, status: 'PENDING', childPipeline: {} }).success,
    ).toBe(false);
  });

  it.each([
    ['run status', RUN_STATUSES, json.properties['status']!.enum],
    ['step status', STEP_STATUSES, stepRecord.properties['status']!.enum],
    ['history type', HISTORY_TYPES, history.properties['type']!.enum],
    [
      'pause status',
      PAUSE_STATUSES,
      json.properties['pause']!.properties!['status'] as unknown as string[],
    ],
  ])('the same %s values', (_name, zod, jsonEnum) => {
    const values: unknown = Array.isArray(jsonEnum)
      ? jsonEnum
      : (jsonEnum as unknown as { enum: string[] }).enum;
    expect([...zod]).toEqual(values);
  });
});
