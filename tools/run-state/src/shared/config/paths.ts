// Copied from tools/validation/src/shared/config/paths.ts — keep the two copies in step.
import { statSync } from 'node:fs';
import path from 'node:path';

/** True when `dir` holds a `.claude/` directory: the mark of a project root. */
export const hasClaudeDir = (dir: string): boolean => {
  try {
    return statSync(path.join(dir, '.claude')).isDirectory();
  } catch {
    return false;
  }
};

/**
 * The nearest ancestor of `start` (itself included) that `isProject`; else `start`. The default
 * mark is a `.claude/` directory, never `.git`: this tool ships inside a git submodule, where
 * `factories/.git` is a file, so a walk from the tool's own file would stop at the kit.
 */
export const findProjectRoot = (
  start: string,
  isProject: (dir: string) => boolean = hasClaudeDir,
): string => {
  const climb = (current: string): string => {
    if (isProject(current)) return current;
    const parent: string = path.dirname(current);
    return parent === current ? path.resolve(start) : climb(parent);
  };
  return climb(path.resolve(start));
};

/** What {{rootPath}} resolves to by default: the project the command is run from. */
export const projectRootFrom = (cwd: string): string => findProjectRoot(cwd);
