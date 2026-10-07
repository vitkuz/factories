import type { FileSystemClient } from '../../../clients/file-system/index.js';
import type { Result } from '../../../shared/types/result.types.js';
import { ok, refuse } from '../../../shared/utils/result.utils.js';
import type { Pipeline } from '../pipeline.types.js';
import { parsePipeline } from './parse-pipeline.service.js';
import { readPipelineFactory } from './read-pipeline.service.js';

export const PIPELINE_CHECKS = {
  exists: { id: 'pipeline-file-exists', description: 'The graph file is on disk.' },
  valid: {
    id: 'pipeline-file-valid',
    description: 'The graph file is JSON that matches the pipeline Zod shape.',
  },
} as const;

/** Read a pipeline.json and check its shape; a typed Pipeline, or a refusal saying what is wrong. */
export const loadPipelineFactory =
  (fileSystem: FileSystemClient) =>
  (file: string): Result<Pipeline> => {
    if (!fileSystem.exists(file)) {
      return refuse(PIPELINE_CHECKS.exists.id)(
        `pipeline file ${file} is missing: cannot read the graph`,
      );
    }
    const read = readPipelineFactory(fileSystem)(file);
    if (!read.ok) return refuse(PIPELINE_CHECKS.valid.id)(read.error);
    const parsed = parsePipeline(read.document);
    return parsed.ok
      ? ok(parsed.pipeline)
      : refuse(PIPELINE_CHECKS.valid.id)(
          `${file} is not a valid pipeline (run the validator): ${parsed.issues.join('; ')}`,
        );
  };
