import { z } from 'zod';

/**
 * The SHAPE of state.json — the Zod twin of `factories/state.schema.json` (that file stays for
 * editors and for the other tools that check against it; tests/state-schema-sync.test.ts fails when
 * the two drift). Strict like the JSON schema: a key it does not know is an error, not lost data.
 */

const timestamp = z.iso.datetime({ offset: true });

export const RUN_STATUSES = [
  'IDLE',
  'RUNNING',
  'PAUSED',
  'COMPLETED',
  'FAILED',
  'ABORTED',
] as const;

export const STEP_STATUSES = [
  'PENDING',
  'RUNNING',
  'COMPLETED',
  'FAILED',
  'SKIPPED',
  'RETRYING',
] as const;

export const HISTORY_TYPES = [
  'PIPELINE_INIT',
  'WAVE_START',
  'STEP_START',
  'STEP_COMPLETE',
  'STEP_FAIL',
  'STEP_RETRY',
  'STEP_SKIP',
  'PIPELINE_PAUSE',
  'PIPELINE_RESUME',
  'PIPELINE_COMPLETE',
  'PIPELINE_FAIL',
  'CHILD_PIPELINE_START',
  'CHILD_PIPELINE_COMPLETE',
  'CHILD_PIPELINE_FAIL',
  'STEP_EVENT',
  'EDGE_CAPPED',
  'HUMAN_ANSWER',
] as const;

export const PAUSE_STATUSES = ['AWAITING_INPUT', 'RESUMED', 'REJECTED'] as const;

export const runStatusSchema = z.enum(RUN_STATUSES);
export const stepStatusSchema = z.enum(STEP_STATUSES);
export const historyTypeSchema = z.enum(HISTORY_TYPES);

export const contextSchema = z.strictObject({
  constants: z.record(z.string(), z.string()),
  params: z.record(z.string(), z.unknown()),
  captured: z.record(z.string(), z.unknown()),
});

export const pauseSchema = z.strictObject({
  step: z.string(),
  status: z.enum(PAUSE_STATUSES),
  ask: z.string(),
  capture: z.string().optional(),
  present: z.array(z.string()).optional(),
  responseSchema: z.record(z.string(), z.unknown()).optional(),
  pausedAt: timestamp.optional(),
});

export interface ChildPipelineRecord {
  name?: string | undefined;
  path: string;
  outputDir?: string | undefined;
  runId?: string | undefined;
  status?: (typeof RUN_STATUSES)[number] | undefined;
  stateFile?: string | undefined;
  startedAt?: string | undefined;
  completedAt?: string | undefined;
  steps?: Record<string, StepRecordShape> | undefined;
  config?: Record<string, unknown> | undefined;
}

export interface StepRecordShape {
  order: number;
  agent?: string | undefined;
  kind?: 'agent' | 'pipeline' | undefined;
  sessionId?: string | undefined;
  transcriptPath?: string | undefined;
  status: (typeof STEP_STATUSES)[number];
  startedAt?: string | undefined;
  completedAt?: string | undefined;
  outputs?: string[] | undefined;
  retryCount?: number | undefined;
  error?: string | undefined;
  skipReason?: string | undefined;
  childPipeline?: ChildPipelineRecord | undefined;
  passes?: number | undefined;
  event?: string | undefined;
  reported?: Record<string, unknown> | undefined;
  note?: string | undefined;
}

export const childPipelineSchema: z.ZodType<ChildPipelineRecord> = z.lazy(() =>
  z.strictObject({
    name: z.string().optional(),
    path: z.string(),
    outputDir: z.string().optional(),
    runId: z.string().optional(),
    status: runStatusSchema.optional(),
    stateFile: z.string().optional(),
    startedAt: timestamp.optional(),
    completedAt: timestamp.optional(),
    steps: z.record(z.string(), stepRecordSchema).optional(),
    config: z.record(z.string(), z.unknown()).optional(),
  }),
);

export const stepRecordSchema = z.strictObject({
  order: z.int(),
  agent: z.string().optional(),
  kind: z.enum(['agent', 'pipeline']).optional(),
  sessionId: z.string().optional(),
  transcriptPath: z.string().optional(),
  status: stepStatusSchema,
  startedAt: timestamp.optional(),
  completedAt: timestamp.optional(),
  outputs: z.array(z.string()).optional(),
  retryCount: z.int().min(0).optional(),
  error: z.string().optional(),
  skipReason: z.string().optional(),
  childPipeline: childPipelineSchema.optional(),
  passes: z.int().min(0).optional(),
  event: z.string().optional(),
  reported: z.record(z.string(), z.unknown()).optional(),
  note: z.string().optional(),
});

export const historyEntrySchema = z.strictObject({
  timestamp,
  type: historyTypeSchema,
  step: z.string().optional(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export const stateSchema = z.strictObject({
  $schema: z.string().optional(),
  runId: z.string(),
  pipelineName: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'must be kebab-case'),
  pipelineFile: z.string().optional(),
  sessionId: z.string().optional(),
  sessionSource: z.string().optional(),
  transcriptPath: z.string().optional(),
  status: runStatusSchema,
  createdAt: timestamp,
  updatedAt: timestamp,
  currentWave: z.int().min(1),
  activeSteps: z.array(z.string()).optional(),
  context: contextSchema,
  pause: pauseSchema.optional(),
  steps: z.record(z.string(), stepRecordSchema),
  history: z.array(historyEntrySchema).optional(),
  mode: z.literal('graph').optional(),
  frontier: z.array(z.string()).optional(),
  edges: z.record(z.string(), z.int().min(0)).optional(),
  vars: z.record(z.string(), z.unknown()).optional(),
});
