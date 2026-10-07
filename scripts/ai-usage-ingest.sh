#!/usr/bin/env bash
# Ingest harness telemetry with `ai-usage` and attribute it to one pipeline run.
#
# Meant as a pipeline `hooks.after` command (this script ships in the factories kit):
#   bash {{rootPath}}/factories/scripts/ai-usage-ingest.sh {{outputDir}}
#
# ai-usage is optional: a project without it (no <project>/tools/ai-usage build and no
# `ai-usage` on PATH) gets one line and exit 0, so the hook never fails a run there.
#
# What it does, in order:
#   1. registers this repository as a factory root with ai-usage (once; idempotent)
#   2. `ai-usage ingest`  — reads new Claude / Codex / Copilot / Antigravity telemetry
#   3. `ai-usage factory report --run <run folder>` — prints the per-step cost of this run
#   4. checks that <run>/cost.json was written next to state.json
#
# Exit 0 when cost.json exists afterwards, 1 otherwise. A hook failure is reported by the
# runner, never fatal: the run is already over when this executes.
set -u

usage() {
  echo "usage: $0 <run-dir>" >&2
  echo "  <run-dir>  the resolved outputDir of a pipeline run, e.g. run/<pipeline>/<slug>-<date>" >&2
}

if [ $# -ne 1 ]; then usage; exit 1; fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# <project>/factories/scripts → <project>
ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
RUN_DIR="$1"
case "${RUN_DIR}" in
  /*) ;;
  *)  RUN_DIR="${ROOT}/${RUN_DIR}" ;;
esac
RUN_DIR="${RUN_DIR%/}"
RUN_NAME="$(basename "${RUN_DIR}")"
AI_USAGE_HOME="${AI_USAGE_HOME:-${HOME}/.ai-usage}"

if [ ! -d "${RUN_DIR}" ]; then
  echo "ai-usage-ingest: run folder does not exist: ${RUN_DIR}" >&2
  exit 1
fi
if [ ! -f "${RUN_DIR}/state.json" ] && [ ! -f "${RUN_DIR}/.state.json" ]; then
  echo "ai-usage-ingest: no state.json in ${RUN_DIR}; ai-usage attributes cost by the run's state file, so there is nothing to attribute" >&2
  exit 1
fi
# Prefer this repository's own build: the global `ai-usage` may be a copy from another
# checkout with older rate cards and attribution.
LOCAL_BIN="${ROOT}/tools/ai-usage/bin/ai-usage.js"
if [ -f "${LOCAL_BIN}" ] && [ -f "${ROOT}/tools/ai-usage/dist/cli/index.js" ]; then
  ai-usage() { node "${LOCAL_BIN}" "$@"; }
  echo "ai-usage-ingest: using ${LOCAL_BIN}"
elif command -v ai-usage >/dev/null 2>&1; then
  echo "ai-usage-ingest: using $(command -v ai-usage) (no local build in ${ROOT}/tools/ai-usage)"
else
  echo "ai-usage-ingest: ai-usage is not available in ${ROOT} (no tools/ai-usage build, none on PATH): skipping cost attribution for ${RUN_NAME}"
  exit 0
fi

echo "ai-usage-ingest: run ${RUN_NAME} (${RUN_DIR})"

# 1. register this repository as a factory root, once
if [ -f "${AI_USAGE_HOME}/config.json" ] && grep -Fq "\"${ROOT}\"" "${AI_USAGE_HOME}/config.json"; then
  echo "ai-usage-ingest: factory root already registered: ${ROOT}"
else
  echo "ai-usage-ingest: registering factory root ${ROOT}"
  ai-usage factory add "${ROOT}" || { echo "ai-usage-ingest: 'ai-usage factory add' failed" >&2; exit 1; }
fi

# 2. ingest new telemetry from every harness; idempotent
echo "ai-usage-ingest: ingesting"
ai-usage ingest || { echo "ai-usage-ingest: 'ai-usage ingest' failed" >&2; exit 1; }

# 3. this run, step by step
echo "ai-usage-ingest: cost of ${RUN_NAME}"
ai-usage factory report --root "${ROOT}" --run "${RUN_NAME}" || echo "ai-usage-ingest: 'ai-usage factory report' failed (continuing)" >&2

# 4. the sidecar dashboards read
if [ -f "${RUN_DIR}/cost.json" ]; then
  echo "ai-usage-ingest: wrote ${RUN_DIR}/cost.json"
  exit 0
fi
echo "ai-usage-ingest: ${RUN_DIR}/cost.json was not written; run 'ai-usage factory report --refresh --run ${RUN_NAME}' and check the attribution" >&2
exit 1
