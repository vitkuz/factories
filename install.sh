#!/usr/bin/env bash
# Links the kit's skills into the project's .claude/skills/, one relative symlink per skill:
#   .claude/skills/<name> -> ../../factories/skills/<name>
# Run it from the project root (the folder holding .claude/ and the factories/ submodule):
#   bash factories/install.sh [--dry-run]
# Idempotent. A .claude/skills/<name> that exists and is not that symlink (a project's own
# skill, a local factory's wrapper) is left alone and listed.
set -u

DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    -h|--help) sed -n '2,8p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "install.sh: unknown argument: $arg" >&2; exit 2 ;;
  esac
done

KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${KIT_DIR}/.." && pwd)"
KIT_NAME="$(basename "${KIT_DIR}")"
SKILLS_DIR="${PROJECT_DIR}/.claude/skills"

if [ ! -d "${PROJECT_DIR}/.claude" ]; then
  echo "install.sh: no .claude/ in ${PROJECT_DIR}: the kit must sit at <project>/factories" >&2
  exit 1
fi
if [ "${DRY_RUN}" -eq 0 ]; then mkdir -p "${SKILLS_DIR}"; fi

linked=0; kept=0; skipped=0
for skill in "${KIT_DIR}"/skills/*/; do
  name="$(basename "${skill}")"
  target="../../${KIT_NAME}/skills/${name}"
  link="${SKILLS_DIR}/${name}"
  if [ -L "${link}" ] && [ "$(readlink "${link}")" = "${target}" ]; then
    kept=$((kept + 1))
    continue
  fi
  if [ -e "${link}" ] || [ -L "${link}" ]; then
    echo "skip   .claude/skills/${name}: exists and is not the kit's symlink (left as is)"
    skipped=$((skipped + 1))
    continue
  fi
  if [ "${DRY_RUN}" -eq 1 ]; then
    echo "would link .claude/skills/${name} -> ${target}"
  else
    ln -s "${target}" "${link}"
    echo "link   .claude/skills/${name} -> ${target}"
  fi
  linked=$((linked + 1))
done

if [ "${DRY_RUN}" -eq 1 ]; then
  echo "install.sh (dry run): ${linked} to link, ${kept} already linked, ${skipped} skipped"
else
  echo "install.sh: ${linked} linked, ${kept} already linked, ${skipped} skipped"
fi
