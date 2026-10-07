import type { FileSystemClient } from '../../../clients/file-system/index.js';
import { parsePipeline, readPipelineFactory } from '../../pipeline/services/index.js';
import type { ParseResult, ReadResult } from '../../pipeline/services/index.js';
import { PIPELINE_RULES, SETUP_RULES, runRules } from '../../rules/index.js';
import type { Finding, SetupContext } from '../../rules/index.js';
import { reportFor } from '../../rules/rules.utils.js';
import type { ValidationReport } from '../validate.types.js';
import { READ_RULE, SCHEMA_RULE, isSeverity, uniqueFindings } from '../validate.utils.js';

const toReport = (
  file: string,
  rulesRan: boolean,
  findings: readonly Finding[],
): ValidationReport => {
  const unique: Finding[] = uniqueFindings(findings);
  return { ok: !unique.some(isSeverity('error')), pipeline: file, rulesRan, findings: unique };
};

/**
 * read → Zod shape → rules. Each stage only runs when the one before it passed; the setup rules
 * always run. Every problem is a finding, never a throw.
 */
export const validatePipelineFactory =
  (fileSystem: FileSystemClient) =>
  (setup: Omit<SetupContext, 'fileSystem'>) =>
  (file: string): ValidationReport => {
    const context: SetupContext = { ...setup, fileSystem };
    const setupFindings: Finding[] = runRules(SETUP_RULES)(context);

    const read: ReadResult = readPipelineFactory(fileSystem)(file);
    if (!read.ok) {
      return toReport(file, false, [reportFor(READ_RULE).error(read.error), ...setupFindings]);
    }

    const parsed: ParseResult = parsePipeline(read.document);
    if (!parsed.ok) {
      const schema: Finding[] = parsed.issues.map((issue: string): Finding =>
        reportFor(SCHEMA_RULE).error(`schema: ${issue}`),
      );
      return toReport(file, false, [...schema, ...setupFindings]);
    }

    const ruleFindings: Finding[] = runRules(PIPELINE_RULES)({
      ...context,
      pipeline: parsed.pipeline,
      document: read.document,
      file,
    });
    return toReport(file, true, [...ruleFindings, ...setupFindings]);
  };
