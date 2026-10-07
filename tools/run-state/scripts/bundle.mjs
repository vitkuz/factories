import { chmodSync } from 'node:fs';
import { build } from 'esbuild';
import { BUNDLE_FILE, bundleOptions } from '../esbuild.config.mjs';

await build({ ...bundleOptions, outfile: BUNDLE_FILE });
chmodSync(BUNDLE_FILE, 0o755);
console.log(`bundled ${BUNDLE_FILE}`);
