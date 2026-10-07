// One source of truth for the bundle: `npm run bundle` writes it, tests/bundle.test.ts checks
// that the committed file is what these options produce today.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** The committed bundle: <kit>/bin/state.mjs, run with plain node, no install. */
export const BUNDLE_FILE = path.resolve(here, '..', '..', 'bin', 'state.mjs');

export const bundleOptions = {
  absWorkingDir: here,
  entryPoints: [path.join(here, 'src', 'cli', 'index.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  // CommonJS dependencies (winston, dotenv) call require(); ESM has none unless we make one.
  banner: {
    js: [
      '#!/usr/bin/env node',
      "import { createRequire as __createRequire } from 'node:module';",
      'const require = __createRequire(import.meta.url);',
    ].join('\n'),
  },
  legalComments: 'none',
  logLevel: 'warning',
};
