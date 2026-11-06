import { Dirent } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { FileSystem } from './sync.types';
import { isSkippedName } from './sync.utils';

// Every regular file under `dir` (recursive, sorted), skipping .git, .DS_Store and node_modules. Symlinks are not followed.
export const walkFiles = async (dir: string): Promise<string[]> => {
  const entries: Dirent[] = await readdir(dir, { withFileTypes: true });
  const kept: Dirent[] = entries
    .filter((entry: Dirent): boolean => !isSkippedName(entry.name))
    .sort((a: Dirent, b: Dirent): number => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const nested: string[][] = await Promise.all(
    kept.map(async (entry: Dirent): Promise<string[]> =>
      entry.isDirectory() ? walkFiles(join(dir, entry.name)) : entry.isFile() ? [join(dir, entry.name)] : [],
    ),
  );
  return nested.flat();
};

// A dir is walked; a single file is its own list.
export const listFiles = async (target: string): Promise<string[]> => ((await stat(target)).isDirectory() ? walkFiles(target) : [target]);

export const nodeFileSystem: FileSystem = {
  listFiles,
  readFile: (absPath: string): Promise<Buffer> => readFile(absPath),
};
