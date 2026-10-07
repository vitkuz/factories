#!/usr/bin/env bash
# Scans the kit for anything that must not reach a public repository. Run before every push:
#   bash scripts/check-secrets.sh [<dir>]      (default: the kit root)
# Uses gitleaks when installed, then its own grep patterns. Exit 1 on any hit.
set -u
KIT_DIR="$(cd "${1:-$(dirname "${BASH_SOURCE[0]}")/..}" && pwd)"
cd "${KIT_DIR}" || exit 2
status=0

if command -v gitleaks >/dev/null 2>&1; then
  gitleaks detect --no-git --source . --redact >/dev/null 2>&1 || { echo "check-secrets: gitleaks found something; run: gitleaks detect --no-git --source ${KIT_DIR}" >&2; status=1; }
fi

FILES="$(git ls-files 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null)"
[ -n "${FILES}" ] || FILES="$(find . -type f -not -path './.git/*' -not -path '*/node_modules/*' -not -path '*/dist/*' | sed 's#^\./##')"
FILES="$(echo "${FILES}" | grep -v -E '^bin/|node_modules/|/dist/|^scripts/check-secrets\.sh$' | sort -u)"

hit() { echo "check-secrets: $1" >&2; status=1; }

scan() { # <label> <regex>
  local found
  found="$(echo "${FILES}" | xargs -r grep -n -E -I -- "$2" 2>/dev/null | head -20)"
  if [ -n "${found}" ]; then hit "$1:"; echo "${found}" >&2; fi
}

scan "AWS access key"            'AKIA[0-9A-Z]{16}'
scan "AWS secret key"            'aws_secret_access_key'
scan "API key"                   '\bsk-[A-Za-z0-9_-]{20,}'
scan "GitHub token"              'gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}'
scan "Slack token"               'xox[bpa]-[A-Za-z0-9-]+'
scan "private key"               '-----BEGIN [A-Z ]*PRIVATE KEY-----'
scan "AWS account id / ARN"      'arn:aws:[a-z0-9-]*:[a-z0-9-]*:[0-9]{12}:|\b[0-9]{12}\b'
scan "email address"             '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
scan "absolute home path"        '/home/[a-z0-9_-]+/|/Users/[A-Za-z0-9_-]+/'
scan "project names of the owner's private projects" 'b3l3o3g3|pisarenko|art-shop'

envs="$(echo "${FILES}" | grep -E '(^|/)\.env(\.|$)' | grep -v '\.env\.example$')"
[ -z "${envs}" ] || hit ".env file(s) present: ${envs}"

[ "${status}" -eq 0 ] && echo "check-secrets: clean (${KIT_DIR})"
exit "${status}"
