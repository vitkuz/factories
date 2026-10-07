#!/usr/bin/env bash
# Fails fast when the machine cannot talk to AWS reliably. Meant as a pipeline `hooks.before` command:
#   bash {{rootPath}}/scripts/aws-preflight.sh <profile> <region> <account>
# Checks: the profile points at the expected account, the clock is within 60 s of AWS,
# and the AWS CLI can reach a dual-stack endpoint (Secrets Manager) through IPv4.
set -u
export AWS_PAGER=""

if [ $# -ne 3 ]; then echo "usage: $0 <profile> <region> <account>" >&2; exit 1; fi
PROFILE="$1"; REGION="$2"; ACCOUNT="$3"
CLI=(--profile "${PROFILE}" --region "${REGION}" --cli-connect-timeout 2)

ACTUAL="$(timeout 60 aws sts get-caller-identity "${CLI[@]}" --query Account --output text 2>&1)"
if [ "${ACTUAL}" != "${ACCOUNT}" ]; then
  echo "preflight: profile ${PROFILE} is account '${ACTUAL}', expected ${ACCOUNT}" >&2; exit 1
fi
echo "preflight: account ${ACCOUNT} via profile ${PROFILE}"

AWS_DATE="$(curl -4 -sI --max-time 10 https://sts.amazonaws.com | grep -i '^date:' | cut -d' ' -f2- | tr -d '\r')"
if [ -n "${AWS_DATE}" ]; then
  SKEW=$(( $(date -u +%s) - $(date -u -d "${AWS_DATE}" +%s) ))
  if [ "${SKEW#-}" -gt 60 ]; then
    echo "preflight: local clock is ${SKEW}s off AWS time; restart WSL (wsl --shutdown) and try again" >&2; exit 1
  fi
  echo "preflight: clock skew ${SKEW}s"
fi

if ! timeout 60 aws secretsmanager list-secrets "${CLI[@]}" --max-results 1 --query 'length(SecretList)' --output text >/dev/null 2>&1; then
  echo "preflight: the AWS CLI cannot reach Secrets Manager (IPv6 without a route?); see the troubleshooting page of the docs site" >&2; exit 1
fi
echo "preflight: AWS CLI reaches Secrets Manager"
