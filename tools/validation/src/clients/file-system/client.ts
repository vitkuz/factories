import fs from 'node:fs';
import type { FileSystemClient } from './types.js';

/** Synchronous on purpose: the validator is one shot, and every rule stays a plain function. */
const readText = (file: string): string => fs.readFileSync(file, 'utf8');

const exists = (target: string): boolean => fs.existsSync(target);

const listDirectories = (directory: string): string[] =>
  exists(directory)
    ? fs
        .readdirSync(directory, { withFileTypes: true })
        .filter((entry: fs.Dirent): boolean => entry.isDirectory())
        .map((entry: fs.Dirent): string => entry.name)
        .sort()
    : [];

type GlobSync = (pattern: string) => string[];

const glob = (pattern: string): string[] | undefined => {
  const globSync: GlobSync | undefined = (fs as unknown as { globSync?: GlobSync }).globSync;
  return globSync === undefined ? undefined : globSync(pattern);
};

export const createFileSystemClient = (): FileSystemClient => ({
  readText,
  exists,
  listDirectories,
  glob,
});
