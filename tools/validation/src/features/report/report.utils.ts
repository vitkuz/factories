import type { Finding } from '../rules/rules.types.js';
import type { PipelineRule, SetupRule } from '../rules/rules.types.js';
import type { ValidationReport, ValidationReportJson } from '../validate/validate.types.js';
import { messagesOf } from '../validate/validate.utils.js';

const line = (finding: Finding): string =>
  `${finding.severity}: ${finding.message}  [${finding.rule}]`;

const count = (report: ValidationReport): string =>
  `${messagesOf('error')(report.findings).length} error(s), ${messagesOf('warning')(report.findings).length} warning(s)`;

/**
 * Validating <file>
 * error: <message>  [rule-id]      errors first, then warnings
 * N error(s), M warning(s)
 */
export const formatText = (report: ValidationReport): string =>
  [
    `Validating ${report.pipeline}`,
    ...report.findings.filter((f: Finding): boolean => f.severity === 'error').map(line),
    ...report.findings.filter((f: Finding): boolean => f.severity === 'warning').map(line),
    ...(report.rulesRan ? [] : ['(graph rules not run: fix the errors above first)']),
    count(report),
  ].join('\n');

export const toJson = (report: ValidationReport): ValidationReportJson => ({
  ok: report.ok,
  pipeline: report.pipeline,
  errors: messagesOf('error')(report.findings),
  warnings: messagesOf('warning')(report.findings),
  rulesRan: report.rulesRan,
  findings: report.findings,
});

export const formatJson = (report: ValidationReport): string =>
  JSON.stringify(toJson(report), null, 2);

type AnyRule = SetupRule | PipelineRule;

/** --list-rules: what the validator checks, in the order it checks it. */
export const formatRules = (
  setupRules: readonly SetupRule[],
  pipelineRules: readonly PipelineRule[],
): string => {
  const rows = (rules: readonly AnyRule[]): string[] => {
    const width: number = Math.max(...rules.map((rule: AnyRule): number => rule.id.length));
    return rules.map((rule: AnyRule): string => `  ${rule.id.padEnd(width)}  ${rule.description}`);
  };
  return [
    'shape (src/features/pipeline/pipeline.schema.ts)',
    '  schema  pipeline.json matches the Zod shape; the rules below run only when it does',
    '',
    'pipeline rules (src/features/rules/pipeline/)',
    ...rows(pipelineRules),
    '',
    'setup rules (src/features/rules/setup/)',
    ...rows(setupRules),
  ].join('\n');
};
