import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { describe, expect, it } from 'vitest';
import { BUNDLE_FILE, bundleOptions } from '../esbuild.config.mjs';

/** The committed bin/validate.mjs must be what the sources bundle to today: run `npm run bundle`. */
describe('the committed bundle', () => {
  it('is up to date (else: npm run bundle)', async () => {
    const result = await build({ ...bundleOptions, write: false });
    const fresh: string = result.outputFiles?.[0]?.text ?? '';
    expect(fresh.length).toBeGreaterThan(0);
    expect(readFileSync(BUNDLE_FILE, 'utf8')).toBe(fresh);
  });
});
