import path from 'node:path';
import type { SetupContext, SetupRule } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';

export const rootHasClaude: SetupRule = defineRule<SetupContext>({
  id: 'root-has-claude',
  description: 'The root holds a .claude/ folder, so {{rootPath}} paths resolve.',
})(({ rootPath, fileSystem }, report) =>
  fileSystem.exists(path.join(rootPath, '.claude'))
    ? []
    : [
        report.warning(
          `no .claude/ in ${rootPath}: {{rootPath}} paths resolve wrongly; pass --root <repository root>`,
        ),
      ],
);
