import type { Finding, Severity } from '../rules/rules.types.js';

/** The verdict on one pipeline. `ok` is the gate: no errors. */
export interface ValidationReport {
  ok: boolean;
  /** Absolute path of the pipeline.json, or what was asked for when it could not be found. */
  pipeline: string;
  /** False when the shape failed, so the graph rules did not run. */
  rulesRan: boolean;
  findings: Finding[];
}

/** The --json report: `errors` and `warnings` as plain text for older readers, `findings` with rule ids. */
export interface ValidationReportJson {
  ok: boolean;
  pipeline: string;
  errors: string[];
  warnings: string[];
  rulesRan: boolean;
  findings: Finding[];
}

export type { Finding, Severity };
