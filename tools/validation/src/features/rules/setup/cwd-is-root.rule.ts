import path from 'node:path';
import type { SetupContext, SetupRule } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';

export const cwdIsRoot: SetupRule = defineRule<SetupContext>({
  id: 'cwd-is-root',
  description: 'The validator runs from the repository root, as the harness does.',
})(({ rootPath, cwd }, report) =>
  path.resolve(cwd) === path.resolve(rootPath)
    ? []
    : [
        report.warning(
          `working directory ${cwd} is not {{rootPath}} ${rootPath}: run from the repository root, as the harness does`,
        ),
      ],
);
