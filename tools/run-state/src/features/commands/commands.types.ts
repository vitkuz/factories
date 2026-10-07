import type { Clock, RunIdGenerator } from '../../clients/clock/index.js';
import type { Result } from '../../shared/types/result.types.js';
import type { Guard } from '../guards/guards.types.js';
import type { Pipeline, Scalar } from '../pipeline/pipeline.types.js';
import type { Readiness } from '../routing/routing.types.js';
import type { RunStatus, State } from '../state/state.types.js';

/** Everything a command line can carry. Which fields a command reads is up to the command. */
export interface CommandInput {
  /** The command's name, for messages. */
  command: string;
  /** The run folder, absolute. */
  runDir?: string | undefined;
  step?: string | undefined;
  event?: string | undefined;
  /** --output, as given. */
  outputs: readonly string[];
  /** --report name=value, as given. */
  reports: readonly string[];
  /** --param name=value, as given (open). */
  params: readonly string[];
  note?: string | undefined;
  error?: string | undefined;
  reason?: string | undefined;
  /** open: the pipeline id or path. */
  pipelineRef?: string | undefined;
}

/** Input once the run-dir-given guard has passed. */
export type RunInput = CommandInput & { runDir: string };

/** What a command on an open run sees. */
export interface RunContext {
  state: State;
  pipeline: Pipeline;
  input: RunInput;
  clock: Clock;
}

/** What `open` sees: no state yet, and what the use case found out about the files. */
export interface OpenContext {
  pipeline: Pipeline;
  input: RunInput;
  clock: Clock;
  newRunId: RunIdGenerator;
  /** The pipeline file, relative to the repository root when inside it. */
  pipelineFile: string;
  /** The `$schema` pointer written into state.json. */
  schemaRef: string;
  /** CLAUDE_SESSION_ID, or ''. */
  sessionId: string;
  /** Absolute path of the state.json to create. */
  stateFile: string;
}

/** What `show` sees: the state alone (it needs no graph). */
export interface ShowContext {
  state: State;
}

/** A command's effect: the state to write (absent → write nothing) and what to print. */
export interface Applied<Output> {
  state?: State | undefined;
  output: Output;
}

export type CommandResult<Output> = Result<Applied<Output>>;

/** A positional argument a command takes, in order. */
export type ArgumentName = 'pipeline' | 'runDir' | 'step' | 'event';

/** An option a command takes (src/cli/program.ts describes each). */
export type OptionName =
  'param' | 'pipeline' | 'event' | 'answer' | 'output' | 'report' | 'note' | 'error' | 'reason';

interface CommandMeta {
  name: string;
  /** Positional arguments, in order. All optional to the parser: guards say what is missing. */
  arguments: readonly ArgumentName[];
  options: readonly OptionName[];
  /** Arguments after the command name, for help and the README. */
  usage: string;
  /** One sentence: what the command records. */
  summary: string;
  /** Checked on the arguments alone, before any file is read. */
  inputGuards: readonly Guard<CommandInput>[];
}

export interface OpenCommand extends CommandMeta {
  kind: 'open';
  guards: readonly Guard<OpenContext>[];
  apply: (context: OpenContext) => CommandResult<OpenOutput>;
}

export interface RunCommand<Output = unknown> extends CommandMeta {
  kind: 'run';
  guards: readonly Guard<RunContext>[];
  apply: (context: RunContext) => CommandResult<Output>;
}

export interface ShowCommand extends CommandMeta {
  kind: 'show';
  guards: readonly Guard<ShowContext>[];
  apply: (context: ShowContext) => CommandResult<State>;
}

export type AnyCommand = OpenCommand | RunCommand | ShowCommand;

// --- what each command prints ----------------------------------------------------------------

export interface OpenOutput {
  runId: string;
  pipeline: string;
  pipelineFile: string;
  stateFile: string;
  params: Record<string, Scalar>;
  start: string[];
}

export interface StartOutput {
  status: RunStatus;
  ready: string[];
}

export interface StartStepOutput {
  step: string;
  pass: number;
}

/** step-done and human. */
export interface StepEventOutput {
  step: string;
  event: string;
  targets: string[];
  capped: boolean;
  ready: string[];
  waiting: Record<string, string[]>;
  running: string[];
  skipped: string[];
  finished: boolean;
}

export interface FailOutput {
  step: string;
  status: RunStatus;
}

export type SkipOutput = { step: string } & Readiness;

export type ReadyOutput = { status: RunStatus } & Readiness & { done: boolean };

export interface FinishOutput {
  status: RunStatus;
  pipeline: string;
}
