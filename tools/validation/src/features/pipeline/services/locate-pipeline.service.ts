import path from 'node:path';
import type { FileSystemClient } from '../../../clients/file-system/index.js';
import { KEBAB } from '../pipeline.schema.js';
import {
  FACTORY_DIRS,
  LOCAL_FACTORIES_DIR,
  PIPELINE_FILE,
  localPipelineFileFor,
  pipelineFileFor,
  pipelineFileIn,
} from '../pipeline.utils.js';

/** The ids under <root>/factories.local/ and <root>/factories/ that hold a pipeline.json, sorted, once each. */
export const listPipelineIdsFactory =
  (fileSystem: FileSystemClient) =>
  (rootPath: string): string[] => {
    const ids: string[] = FACTORY_DIRS.flatMap((dir: string): string[] =>
      fileSystem
        .listDirectories(path.join(rootPath, dir))
        .filter((id: string): boolean => fileSystem.exists(pipelineFileIn(dir)(rootPath)(id))),
    );
    return [...new Set(ids)].sort();
  };

/** An id's file: the project's own (<root>/factories.local/<id>/) when it exists, else the shared one. */
export const pipelineFileOfIdFactory =
  (fileSystem: FileSystemClient) =>
  (rootPath: string) =>
  (id: string): string => {
    const local: string = localPipelineFileFor(rootPath)(id);
    return fileSystem.exists(local) ? local : pipelineFileFor(rootPath)(id);
  };

/**
 * "<id>" or "path/to/pipeline.json" (or its folder) → an absolute pipeline file. An id is looked up
 * under <root>/factories.local/, then <root>/factories/; a path is taken from the working directory.
 * Throws, naming the ids.
 */
export const locatePipelineFactory =
  (fileSystem: FileSystemClient) =>
  (rootPath: string, cwd: string) =>
  (idOrPath: string | undefined): string => {
    const ids: string = listPipelineIdsFactory(fileSystem)(rootPath).join(', ') || '(none found)';
    if (!idOrPath) {
      throw new Error(`name a pipeline: one of ${ids}, or a path to a pipeline.json`);
    }
    const byId: string = pipelineFileOfIdFactory(fileSystem)(rootPath)(idOrPath);
    if (KEBAB.test(idOrPath) && fileSystem.exists(byId)) return byId;
    const asPath: string = path.resolve(cwd, idOrPath);
    if (fileSystem.exists(asPath)) {
      return asPath.endsWith('.json') ? asPath : path.join(asPath, PIPELINE_FILE);
    }
    throw new Error(
      `no pipeline "${idOrPath}": expected ${byId} (or the same under ${LOCAL_FACTORIES_DIR}/) or a path to a pipeline.json. Available ids: ${ids}`,
    );
  };
