#!/usr/bin/env bash
# Scans this repository for anything that must not reach a public repository. Run before every push:
#   bash scripts/check-secrets.sh [<dir>]      (default: the repository root)
# Uses gitleaks when installed, then its own grep patterns. Exit 1 on any hit.
# The patterns for the owner's private project names, tenants and account values come from the
# anonymize rules that once prepared the kit for publishing; extend the list when a new private
# project starts using these tools.
set -u
REPO_DIR="$(cd "${1:-$(dirname "${BASH_SOURCE[0]}")/..}" && pwd)"
cd "${REPO_DIR}" || exit 2
status=0

if command -v gitleaks >/dev/null 2>&1; then
  gitleaks detect --no-git --source . --redact >/dev/null 2>&1 || { echo "check-secrets: gitleaks found something; run: gitleaks detect --no-git --source ${REPO_DIR}" >&2; status=1; }
else
  echo "check-secrets: gitleaks is not installed; grep patterns only"
fi

FILES="$(git ls-files 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null)"
[ -n "${FILES}" ] || FILES="$(find . -type f -not -path './.git/*' -not -path '*/node_modules/*' -not -path '*/dist/*' | sed 's#^\./##')"
FILES="$(echo "${FILES}" | grep -v -E '^bin/|node_modules/|/dist/|package-lock\.json$|^scripts/check-secrets\.sh$' | sort -u)"

hit() { echo "check-secrets: $1" >&2; status=1; }

scan() { # <label> <regex>
  local found
  found="$(echo "${FILES}" | xargs -r grep -n -P -I -- "$2" 2>/dev/null | head -20)"
  if [ -n "${found}" ]; then hit "$1:"; echo "${found}" >&2; fi
}

scan "AWS access key"            'AKIA[0-9A-Z]{16}'
scan "AWS secret key"            'aws_secret_access_key'
scan "API key"                   '\bsk-[A-Za-z0-9_-]{20,}'
scan "GitHub token"              'gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}'
scan "Slack token"               'xox[bpa]-[A-Za-z0-9-]+'
scan "private key"               '-----BEGIN [A-Z ]*PRIVATE KEY-----'
# a bare 12-digit number, but not a UUID segment (after a dash) and not a token counter
scan "AWS account id / ARN"      'arn:aws:[a-z0-9-]*:[a-z0-9-]*:[0-9]{12}:|(?<![\d-])(?<!nano_aiu": )[0-9]{12}(?![\d-])'
scan "AWS profile of the owner"  'awsProfile=personal|--profile personal'
scan "email address"             '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
scan "absolute home path"        '/home/(?!me/|you/|user/)[a-z0-9_-]+/|/Users/[A-Za-z0-9_-]+/'
scan "private hosts of the owner" '[a-z0-9.-]+\.(cloudfront\.net|on\.aws|execute-api\.[a-z0-9-]+\.amazonaws\.com)|\.vitkuz\.com'
scan "project names of the owner's private projects" 'b3l3o3g3|pisarenko|art-shop|dataportal-factory|datahub-factory|vitkuz-factory-buid-factory|kuzmenka'

envs="$(echo "${FILES}" | grep -E '(^|/)\.env(\.|$)' | grep -v '\.env\.example$')"
[ -z "${envs}" ] || hit ".env file(s) present: ${envs}"

[ "${status}" -eq 0 ] && echo "check-secrets: clean (${REPO_DIR})"
exit "${status}"
