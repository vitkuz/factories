// Copied from tools/validation/src/features/pipeline/pipeline.types.ts — keep the two copies in step.
import type { z } from 'zod';
import type { edgeSchema, pipelineSchema, stepSchema } from './pipeline.schema.js';

export type Pipeline = z.infer<typeof pipelineSchema>;
export type Step = z.infer<typeof stepSchema>;
export type Edge = z.infer<typeof edgeSchema>;

export type Scalar = string | number | boolean;

/** [event, edge] — one outgoing transition of a step. */
export type EdgeEntry = [string, Edge];

/** [jsonPath, text] — one string somewhere in the pipeline document. */
export type StringAt = [string, string];
