import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** The kit: this tool lives at <kit>/tools/validation. */
export const KIT_ROOT: string = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
);

export interface FixtureProject {
  root: string;
  remove: () => void;
}

/**
 * A throwaway project the way a consumer has it: `.claude/skills/<id>` links to the kit's wrapper
 * skills, `factories` links to the kit (as the submodule would), and `factories.local/<id>` holds
 * what `local` lists. Every real pipeline is checked against this, never against the kit's own folder.
 */
export const fixtureProject = (local: Readonly<Record<string, string>> = {}): FixtureProject => {
  const root: string = mkdtempSync(path.join(os.tmpdir(), 'factory-kit-project-'));
  mkdirSync(path.join(root, '.claude', 'skills'), { recursive: true });
  symlinkSync(KIT_ROOT, path.join(root, 'factories'), 'dir');
  for (const [id, pipelineText] of Object.entries(local)) {
    mkdirSync(path.join(root, 'factories.local', id, 'knowledge'), { recursive: true });
    writeFileSync(path.join(root, 'factories.local', id, 'pipeline.json'), pipelineText);
    mkdirSync(path.join(root, '.claude', 'skills', id), { recursive: true });
  }
  return { root, remove: (): void => rmSync(root, { recursive: true, force: true }) };
};

/** Link every kit wrapper skill into the fixture's .claude/skills, as install.sh does. */
export const installSkills = (root: string, ids: readonly string[]): void => {
  for (const id of ids) {
    const link: string = path.join(root, '.claude', 'skills', id);
    try {
      symlinkSync(path.join('..', '..', 'factories', 'skills', id), link, 'dir');
    } catch {
      // a local factory already has a real folder there
    }
  }
};
