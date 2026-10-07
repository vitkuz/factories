import type { Finding, Severity } from '../rules/rules.types.js';

export const SCHEMA_RULE = 'schema';
export const READ_RULE = 'read';

export const isSeverity =
  (severity: Severity) =>
  (finding: Finding): boolean =>
    finding.severity === severity;

export const messagesOf =
  (severity: Severity) =>
  (findings: readonly Finding[]): string[] =>
    findings.filter(isSeverity(severity)).map((finding: Finding): string => finding.message);

/** Drop repeats of the same severity and message, keeping the first. */
export const uniqueFindings = (findings: readonly Finding[]): Finding[] =>
  findings.filter(
    (finding: Finding, index: number): boolean =>
      findings.findIndex(
        (other: Finding): boolean =>
          other.severity === finding.severity && other.message === finding.message,
      ) === index,
  );
