// Copied from tools/validation/src/features/pipeline/services/read-pipeline.service.ts — keep the two copies in step.
import type { FileSystemClient } from '../../../clients/file-system/index.js';
import { errorMessage } from '../../../shared/utils/error.utils.js';

export type ReadResult = { ok: true; document: unknown } | { ok: false; error: string };

/** Read and JSON-parse a pipeline file. Never throws: a bad file is a finding, not a crash. */
export const readPipelineFactory =
  (fileSystem: FileSystemClient) =>
  (file: string): ReadResult => {
    try {
      return { ok: true, document: JSON.parse(fileSystem.readText(file)) as unknown };
    } catch (error: unknown) {
      return { ok: false, error: `cannot read ${file}: ${errorMessage(error)}` };
    }
  };
