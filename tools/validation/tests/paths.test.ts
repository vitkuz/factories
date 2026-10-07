import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { findProjectRoot, projectRootFrom } from '../src/shared/config/paths.js';

/** A project whose factories/ is a git submodule: `factories/.git` is a FILE, not a folder. */
const scratch: string = mkdtempSync(path.join(os.tmpdir(), 'factory-kit-root-'));
const project: string = path.join(scratch, 'project');
mkdirSync(path.join(project, '.claude', 'skills'), { recursive: true });
mkdirSync(path.join(project, 'factories', 'tools', 'validation', 'src'), { recursive: true });
writeFileSync(path.join(project, 'factories', '.git'), 'gitdir: ../.git/modules/factories\n');
mkdirSync(path.join(project, '.git'), { recursive: true });
mkdirSync(path.join(scratch, 'loose'), { recursive: true });
afterAll(() => rmSync(scratch, { recursive: true, force: true }));

describe('the project root', () => {
  it('is the nearest folder above the working directory with a .claude/ directory', () => {
    expect(projectRootFrom(project)).toBe(project);
    expect(projectRootFrom(path.join(project, 'run', 'x'))).toBe(project);
  });

  it('is never the submodule, whose .git is a file', () => {
    expect(projectRootFrom(path.join(project, 'factories'))).toBe(project);
    expect(projectRootFrom(path.join(project, 'factories', 'tools', 'validation', 'src'))).toBe(
      project,
    );
  });

  it('falls back to the working directory itself', () => {
    expect(projectRootFrom(path.join(scratch, 'loose'))).toBe(path.join(scratch, 'loose'));
  });

  it('takes any mark', () => {
    expect(findProjectRoot('/a/b/c', (dir: string): boolean => dir === '/a')).toBe('/a');
  });
});
