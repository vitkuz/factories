import { promises as fs, Dirent } from 'node:fs';
import path from 'node:path';
import { semanticCoreSchema } from './record-processing.schema';
import { SemanticCore } from './record-processing.types';
import { IGNORED_NAMES } from './record-processing.utils';

// Where the extract-core step writes the semantic core, relative to the run folder.
export const SEMANTIC_CORE_FILE = path.join('1-extract-core', 'semantic-core.json');

// Every file under `dir`, recursively, absolute paths, sorted; skips .git, .DS_Store, node_modules.
export const listFiles = async (dir: string): Promise<string[]> => {
  const entries: Dirent[] = await fs.readdir(dir, { withFileTypes: true });
  const nested: string[][] = await Promise.all(
    entries
      .filter((entry: Dirent): boolean => !IGNORED_NAMES.includes(entry.name))
      .map(async (entry: Dirent): Promise<string[]> => {
        const full: string = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          return listFiles(full);
        }
        return entry.isFile() ? [full] : [];
      }),
  );
  return nested.flat().sort();
};

// The run's semantic core, or `undefined` when the run has none; a file that is not the expected JSON throws.
export const readSemanticCore = async (runDir: string): Promise<SemanticCore | undefined> => {
  const text: string | undefined = await fs.readFile(path.join(runDir, SEMANTIC_CORE_FILE), 'utf8').catch((): undefined => undefined);
  if (text === undefined) {
    return undefined;
  }
  return semanticCoreSchema.parse(JSON.parse(text)) as SemanticCore;
};
