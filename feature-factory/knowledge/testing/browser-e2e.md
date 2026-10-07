# Browser end-to-end test

Test the front built locally against the deployed API, in a real browser (Playwright MCP tools).

## Setup

1. `npm run front-env` in `repos/tools` writes `repos/front/.env` with the real API and files URLs.
2. `npm run build` in `repos/front`, then serve it: `npx vite preview --port 4173 --strictPort` in the background. Stop it when you finish.
3. Log in through the UI as the superadmin (password read as in the disposable API tests note, typed into the form, never printed or saved in a screenshot name).

## What to test

- Every screen and flow the plan lists, as a user would do it: click, type, upload, save, reload.
- The page after each action: the right data shows, no error message, nothing stuck on "Loading…".
- The browser console: no errors (network errors from deliberate 4xx tests excepted).
- Layout at desktop width and at 390 px wide.
- Items you create start with `smoke-`; delete them at the end through the UI or the API.

## Report

Per flow: steps, expected, got, pass/fail, and a screenshot file for each screen checked (save them in your output folder). Say whether a failure is in the front or in the API (status code and body of the failing request). An API bug is reported as a back bug, not fixed in the front.
