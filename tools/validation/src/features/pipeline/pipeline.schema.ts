import { z } from 'zod';

/**
 * The SHAPE of pipeline.json — the Zod twin of `factories/pipeline.schema.json`
 * (that file stays for editor autocomplete; tests/schema-sync.test.ts fails when the two drift).
 *
 * Shape only: is it an object, are the keys known, do names look right. What the graph MEANS —
 * targets exist, steps are reachable, placeholders are declared — is a rule in src/features/rules/.
 *
 * Messages are written to read after a path: `pipeline.steps.review.model: must be one of …`.
 */

export const KEBAB: RegExp = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const STEP_OR_END: RegExp = /^([a-z][a-z0-9]*(-[a-z0-9]+)*|END)$/;
const IDENTIFIER: RegExp = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const EVENT: RegExp = /^[A-Z][A-Z0-9_]*$/;

const kebab = (what: string): z.ZodString =>
  z.string().regex(KEBAB, `${what} must be kebab-case and start with a letter`);

const identifier: z.ZodString = z
  .string()
  .regex(IDENTIFIER, 'must be an identifier (letters, digits, _)');

const nonEmpty: z.ZodString = z.string().min(1, 'must have at least 1 character(s)');

const scalar = z.union([z.string(), z.number(), z.boolean()], {
  error: 'must be string or number or boolean',
});

const atLeastOne = <T extends z.ZodType>(item: T): z.ZodArray<T> =>
  z.array(item).min(1, 'must have at least 1 item(s)');

const stepName: z.ZodString = kebab('a step name');

const target: z.ZodString = z.string().regex(STEP_OR_END, 'must be a kebab-case step name or END');

export const edgeSchema = z
  .strictObject({
    target: atLeastOne(target),
    max: z.int('must be integer').min(1, 'must be >= 1').optional(),
    onMax: atLeastOne(target).optional(),
    condition: nonEmpty.optional(),
  })
  .refine((edge): boolean => edge.onMax === undefined || edge.max !== undefined, {
    message: '"onMax" needs "max"',
  });

export const modelSchema = z.enum(['fable', 'opus', 'sonnet', 'haiku'], {
  error: 'must be one of "fable", "opus", "sonnet", "haiku"',
});

export const stepSchema = z.strictObject({
  agent: nonEmpty,
  model: modelSchema.optional(),
  prompt: atLeastOne(z.string()),
  system: z.array(z.string()).optional(),
  input: z.array(z.string()).optional(),
  output: z.array(z.string()).optional(),
  knowledge: z.array(z.string()).optional(),
  workDir: z.string().optional(),
  transitions: z
    .record(z.string().regex(EVENT, 'an event must be UPPER_SNAKE_CASE'), edgeSchema)
    .refine((edges): boolean => Object.keys(edges).length > 0, {
      message: 'must have at least 1 key(s)',
    }),
});

export const constantsSchema = z
  .object({
    rootPath: z.literal('cwd', { error: 'must be "cwd"' }),
    skillPath: z.literal('.', { error: 'must be "."' }),
    homePath: z.literal('~', { error: 'must be "~"' }),
  })
  .catchall(scalar);

export const hooksSchema = z.strictObject({
  before: z.array(nonEmpty).optional(),
  after: z.array(nonEmpty).optional(),
});

export const pipelineSchema = z.strictObject({
  $schema: z.string().optional(),
  id: kebab('the id'),
  name: nonEmpty.optional(),
  author: nonEmpty.optional(),
  description: nonEmpty.optional(),
  constants: constantsSchema,
  params: z.record(identifier, scalar).optional(),
  hooks: hooksSchema.optional(),
  outputDir: nonEmpty,
  START: atLeastOne(target),
  steps: z.record(stepName, stepSchema).refine((steps): boolean => Object.keys(steps).length > 0, {
    message: 'must have at least 1 key(s)',
  }),
});
