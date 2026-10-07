import path from 'node:path';
import type { FileSystemClient } from '../../../clients/file-system/index.js';
import type { Step } from '../../pipeline/pipeline.types.js';
import type { Finding, PipelineContext, PipelineRule, Report } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';
import {
  FACTORY_DATA_DIR,
  hasGlob,
  hasPlaceholder,
  isProjectData,
  stepEntries,
  staticValues,
  substitute,
} from '../../pipeline/pipeline.utils.js';

interface KnowledgeFile {
  where: string;
  written: string;
  resolved: string;
  /** Where the file may be: absolute as is, else next to the pipeline, then under the root. */
  candidates: string[];
}

/** One knowledge entry → the verdict on it. */
const verdict =
  (fileSystem: FileSystemClient, report: Report, projectData: (file: string) => boolean) =>
  ({ where, written, resolved, candidates }: KnowledgeFile): Finding[] => {
    if (hasPlaceholder(resolved)) {
      return [
        report.warning(
          `${where}: "${written}" uses a run-time variable and cannot be checked before the run`,
        ),
      ];
    }
    if (hasGlob(resolved)) {
      const matches: (string[] | undefined)[] = candidates.map(fileSystem.glob);
      if (matches.some((match: string[] | undefined): boolean => match === undefined)) {
        return [
          report.warning(
            `${where}: "${written}" is a glob and this Node (${process.version}) cannot expand it before the run`,
          ),
        ];
      }
      return matches.some((match: string[] | undefined): boolean => (match ?? []).length > 0)
        ? []
        : [report.error(`${where}: "${written}" matches no file (${candidates[0]})`)];
    }
    if (candidates.some(fileSystem.exists)) return [];
    // a file under factory-data/ is the project's own, written by runs: a first run has none yet
    return projectData(candidates[0] ?? resolved)
      ? [
          report.warning(
            `${where}: "${written}" is project data not created yet (${candidates[0]}); the run reads it as empty`,
          ),
        ]
      : [report.error(`${where}: "${written}" does not exist (${candidates[0]})`)];
  };

export const knowledgeExists: PipelineRule = defineRule<PipelineContext>({
  id: 'knowledge-exists',
  description: `Every "knowledge" file exists once {{rootPath}}, {{skillPath}}, {{homePath}} and constants are resolved (a missing one under ${FACTORY_DATA_DIR}/ is a warning).`,
})(({ pipeline, file, rootPath, homePath, fileSystem }, report) => {
  const resolve = substitute(staticValues(rootPath, homePath)(pipeline));
  const factoryDir: string = path.dirname(file);
  const toKnowledgeFile =
    (where: string) =>
    (written: string): KnowledgeFile => {
      const resolved: string = resolve(written);
      return {
        where,
        written,
        resolved,
        candidates: path.isAbsolute(resolved)
          ? [resolved]
          : [path.resolve(factoryDir, resolved), path.resolve(rootPath, resolved)],
      };
    };
  return stepEntries(pipeline)
    .flatMap(([name, step]: [string, Step]): KnowledgeFile[] =>
      (step.knowledge ?? []).map(toKnowledgeFile(`steps.${name}.knowledge`)),
    )
    .flatMap(verdict(fileSystem, report, isProjectData(rootPath)));
});
