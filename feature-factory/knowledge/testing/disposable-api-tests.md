# Disposable API tests

Test the deployed API with small scripts written for this one run and thrown away.

## Setup

- Write the scripts in your scratch folder only, never in `repos/`. Plain `bash` + `curl` + `jq`, or a single `.mjs` file run with `node` (built-ins only, `fetch`).
- API URL: `urls.api` in `repos/docs/src/data/dev.json`.
- Admin token: read the password inside the script and never print it:
  `PW=$(aws secretsmanager get-secret-value --secret-id <the project secret named in dev.json, e.g. <tenant>-<project>-secrets-<env>> --profile <awsProfile> --region <awsRegion> --cli-connect-timeout 2 --query SecretString --output text | jq -r .superadminPassword)`,
  log in with `POST /v1/user/login` as the superadmin email from `dev.json`, keep only the token, `unset PW`.
- Every item you create has a title, name or slug starting with `smoke-`, so it is recognisable and never mistaken for real content.

## What to test

- Every new or changed route from the API contract: the happy path, a bad body (400), no token (401) for admin routes, a missing item (404), and a conflict (409) where a unique field exists.
- Public routes without a token.
- Side effects that are asynchronous (search index via the db stream, tasks via the queue): poll with a short sleep up to 30 s before calling it a failure.
- Read the Lambda logs for errors during the test: `aws logs filter-log-events --log-group-name /aws/lambda/<function> --start-time <ms> --filter-pattern '{ $.level = "error" }'` (with the CLI flags from the WSL note).

## Record the contract as built

Write what the deployed API really does, not what the plan said: per route, the path, public or admin, the body with types and limits, the answer, the status codes, and one real request and answer from your test (tokens and passwords removed). Then list every difference from the planned contract. The front is built from this record alone.

## Cleanup

Delete every `smoke-` item you created through the API (so files and the search index are cleaned too), then check it is gone. Cleanup runs even when a test failed. Report anything you could not delete.

## Report

A table: route, case, expected, got, pass/fail. Then the errors found in the logs. Then the cleanup result. Never paste the token or the password.
