/**
 * THE RULE REGISTRY — everything the validator checks beyond the Zod shape.
 *
 * Add a rule:    write `<setup|pipeline>/<rule-id>.rule.ts` with defineRule(), import it here,
 *                put it in the list. Its id shows next to each finding and in --list-rules.
 * Remove a rule: delete its line here (and its file).
 * Change one:    edit its file; each rule is a single pure function of the context.
 *
 * Order is output order. A rule returns errors (fail the gate) or warnings (never do).
 */
import type { PipelineRule, SetupRule } from './rules.types.js';
import { cwdIsRoot } from './setup/cwd-is-root.rule.js';
import { rootHasClaude } from './setup/root-has-claude.rule.js';
import { anchorsFirst } from './pipeline/anchors-first.rule.js';
import { endReachable } from './pipeline/end-reachable.rule.js';
import { humanStep } from './pipeline/human-step.rule.js';
import { idMatchesFolder } from './pipeline/id-matches-folder.rule.js';
import { knowledgeExists } from './pipeline/knowledge-exists.rule.js';
import { loopsCapped } from './pipeline/loops-capped.rule.js';
import { outputDirNotRecursive } from './pipeline/output-dir-not-recursive.rule.js';
import { placeholdersDeclared } from './pipeline/placeholders-declared.rule.js';
import { schemaRef } from './pipeline/schema-ref.rule.js';
import { startExists } from './pipeline/start-exists.rule.js';
import { stepsReachable } from './pipeline/steps-reachable.rule.js';
import { targetsExist } from './pipeline/targets-exist.rule.js';
import { wrapperSkillExists } from './pipeline/wrapper-skill-exists.rule.js';

/** Run on every invocation, even when the pipeline cannot be read. */
export const SETUP_RULES: readonly SetupRule[] = [rootHasClaude, cwdIsRoot];

/** Run once pipeline.json has passed the Zod shape (src/features/pipeline/pipeline.schema.ts). */
export const PIPELINE_RULES: readonly PipelineRule[] = [
  // the graph
  startExists,
  targetsExist,
  stepsReachable,
  endReachable,
  loopsCapped,
  humanStep,
  // names and paths
  placeholdersDeclared,
  outputDirNotRecursive,
  knowledgeExists,
  // conventions
  anchorsFirst,
  schemaRef,
  idMatchesFolder,
  wrapperSkillExists,
];

export { defineRule, runRules } from './rules.utils.js';
export type * from './rules.types.js';
