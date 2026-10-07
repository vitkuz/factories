#!/usr/bin/env bash
# Fails when a committed bundle in bin/ is not what the tool's sources bundle to today.
#   bash scripts/check-bundles.sh         (needs the tools' devDependencies: npm install in each)
# The same check runs as tests/bundle.test.ts in each tool.
set -u
KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
status=0
for tool in validation run-state; do
  dir="${KIT_DIR}/tools/${tool}"
  [ -d "${dir}/node_modules" ] || { echo "check-bundles: ${tool}: run 'npm --prefix ${dir} install' first" >&2; status=2; continue; }
  if ! (cd "${dir}" && npx vitest run tests/bundle.test.ts >/dev/null 2>&1); then
    echo "check-bundles: ${tool}: bin/ is stale; run 'npm --prefix ${dir} run bundle' and commit" >&2
    status=1
  else
    echo "check-bundles: ${tool}: bundle is up to date"
  fi
done
exit "${status}"
