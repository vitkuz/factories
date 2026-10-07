#!/usr/bin/env node
// Runs the compiled run recorder. The build is not committed (dist/ is ignored), so a fresh checkout
// gets a plain instruction instead of a module-not-found stack.
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const entry = join(here, '..', 'dist', 'cli', 'index.js');

if (!existsSync(entry)) {
  process.stderr.write(
    `the run recorder is not built yet. From the repository root run:\n` +
      `  npm --prefix tools/run-state install && npm --prefix tools/run-state run build\n`,
  );
  process.exit(2);
}

await import(entry);
