import fs from 'node:fs';
import type { FileSystemClient } from './types.js';

/** Synchronous on purpose: every command is one short shot, and the use cases stay plain functions. */
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

const makeDirectory = (directory: string): void => {
  fs.mkdirSync(directory, { recursive: true });
};

const writeTextAtomic = (file: string, text: string): void => {
  const temp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temp, text);
  fs.renameSync(temp, file);
};

export const createFileSystemClient = (): FileSystemClient => ({
  readText,
  exists,
  listDirectories,
  makeDirectory,
  writeTextAtomic,
});
