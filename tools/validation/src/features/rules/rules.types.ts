import type { FileSystemClient } from '../../clients/file-system/index.js';
import type { Pipeline } from '../pipeline/pipeline.types.js';

export type Severity = 'error' | 'warning';

/** One thing a rule found. Errors fail the gate; warnings never do. */
export interface Finding {
  rule: string;
  severity: Severity;
  message: string;
}

/** What every rule may look at: where the harness runs, and the disk. */
export interface SetupContext {
  /** What {{rootPath}} resolves to: the repository root. */
  rootPath: string;
  cwd: string;
  homePath: string;
  fileSystem: FileSystemClient;
}

/** What a pipeline rule may look at: the setup, plus a pipeline that passed the Zod shape. */
export interface PipelineContext extends SetupContext {
  pipeline: Pipeline;
  /** The document exactly as read — key order kept, which the parsed pipeline does not promise. */
  document: unknown;
  /** Absolute path of the pipeline.json being checked. */
  file: string;
}

/** Builds findings already stamped with the rule's id. */
export interface Report {
  error: (message: string) => Finding;
  warning: (message: string) => Finding;
}

export interface RuleMeta {
  /** kebab-case, unique; printed next to every finding and by --list-rules. */
  id: string;
  /** One sentence: what must hold for the rule to stay quiet. */
  description: string;
}

export interface Rule<Context> extends RuleMeta {
  check: (context: Context) => Finding[];
}

export type SetupRule = Rule<SetupContext>;
export type PipelineRule = Rule<PipelineContext>;
