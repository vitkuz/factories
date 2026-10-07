/create-any-factory feature-factory

Build a pipeline that takes a Jira ticket and ships the feature across two
repos: it fetches the ticket, scouts both codebases, plans the work, implements
and deploys the backend to dev, proves the deploy, builds the frontend, tests
the feature in a real browser, and opens the pull requests.

Every expensive or outward-facing move is gated by a human: deploying, writing
the verification, running the browser tests, opening the PRs. Each gate has a
skip that moves the run forward, so a human who already knows the answer is
never forced through a step — and every skip is recorded, because the PR step
reports what was actually verified.

It touches real repos and a real environment, so it is conservative: it only
implements what the ticket asks for, it never deploys anything but {{dev_env}},
and it stops rather than guessing.

MCP THIS PIPELINE NEEDS
- Jira, via the Atlassian MCP server. `fetch-ticket` uses it. If the tool is
  not there, the step stops the run — it must never write a ticket file from
  the ticket key alone.
- Playwright, via the Playwright MCP server (npx @playwright/mcp@latest).
  `test-frontend` uses it, and it must drive the SAME browser session the human
  logged into — a fresh context is a logged-out context.

PARAMS
- ticket         Jira ticket key, e.g. PROJ-123. No useful default — ask if
  missing.
- backend_path   path to the backend repo. No useful default — ask if missing.
- frontend_path  path to the frontend repo. No useful default — ask if missing.
- dev_env        environment to deploy to. Default: "dev".
- local_port     port the frontend dev server listens on. Default: 3000.
- branch_prefix  prefix for the feature branches; each branch is
  {{branch_prefix}}/{{ticket}}. Default: "feature".

CONSTANTS
- rootPath  .
- format    markdown

THE REPOS ARE NOT `input`
Both repos live outside the run folder, so they are never a step `input` — an
`input` has to be some earlier step's `output`. Steps reach them through
{{backend_path}} / {{frontend_path}} named in the prompt, and the steps that
modify code or run servers get a workDir:
- build-backend, deploy-backend, verify-backend -> workDir {{backend_path}}
- build-frontend, serve-local, test-frontend    -> workDir {{frontend_path}}

STEPS

1. fetch-ticket  (general-purpose)
   Fetch {{ticket}} with the Atlassian MCP and save it whole: summary,
   description, acceptance criteria, status, labels, linked issues, and the
   comments. Do not summarise it away — later steps read this file instead of
   Jira. Write it in {{format}}.
   FOUND when the ticket came back from the MCP, UNAVAILABLE when the MCP tool
   is missing or the ticket cannot be read. Name both events in the prompt;
   UNAVAILABLE ends the run.
   output: 1-fetch-ticket/ticket.md
   FOUND       -> scout-backend, scout-frontend
   UNAVAILABLE -> END

2. scout-backend  (general-purpose)
   Read the ticket and investigate {{backend_path}}: where the feature belongs,
   which modules, endpoints, schemas and tests it touches, what already exists
   that should be reused, and what will have to change. Name file:line for
   every claim. This step may spawn its own subagents to sweep several parts of
   the tree in parallel and collect what they find into one report — say so in
   the prompt. It writes no code.
   Have it also record, per service or module it names, the test files that
   cover it — build-backend uses that list to avoid running the whole suite.
   input:  1-fetch-ticket/ticket.md
   output: 2-scout-backend/report.md
   DONE -> plan-implementation

3. scout-frontend  (general-purpose)
   Same for {{frontend_path}}: the screens, routes, components, state and API
   calls the feature touches, what to reuse, and how the app authenticates —
   the test step will need to know what a logged-in session looks like. Same
   subagent fan-out, same file:line rule, no code.
   input:  1-fetch-ticket/ticket.md
   output: 3-scout-frontend/report.md
   DONE -> plan-implementation

   (Both scouts point at plan-implementation, so it runs once, after both.)

4. plan-implementation  (general-purpose)
   Read the ticket and both reports and write ONE plan in two files: a backend
   plan and a frontend plan. One step writes both on purpose — the API contract
   between them has to be a single decision, so pin the endpoints, payload
   shapes and error cases once and have both plans quote the same contract.
   Each plan lists the files to change, in order, with the acceptance criterion
   each change serves. Anything the ticket does not ask for is listed under
   "out of scope", not planned.
   input:  1-fetch-ticket/ticket.md, 2-scout-backend/report.md,
           3-scout-frontend/report.md
   output: 4-plan-implementation/backend-plan.md,
           4-plan-implementation/frontend-plan.md
   DONE -> build-backend

5. build-backend  (general-purpose)
   Implement the backend plan in {{backend_path}}. Follow the plan; if the plan
   is wrong, say so in the changes file rather than quietly doing something
   else. No work outside the plan: no refactors, no formatting, no dependency
   bumps. Add tests for the new behaviour.
   NEVER RUN THE WHOLE TEST SUITE. Run only the tests for the services you
   touched — the test files listed for those services in the scout report, plus
   any test you added. The full suite costs minutes this pipeline does not need
   to spend; the deploy verification is what catches what a scoped run misses.
   Say this in the prompt in those terms, and have the step record the exact
   test command it ran and which services it covered, so the reason for the
   narrow run is auditable.
   Write a changes file listing every file touched, the plan item it serves,
   the services touched, and the test results.
   On a retry pass, read 7-deploy-backend/deployment.md and
   9-verify-backend/verification.md first, state in the changes file what
   actually went wrong, and fix that — do not start over.
   workDir: {{backend_path}}
   input:  4-plan-implementation/backend-plan.md, 2-scout-backend/report.md
   output: 5-build-backend/changes.md
   DONE -> confirm-deploy

6. confirm-deploy  (human)
   The deploy gate. Ask: the backend is built — read 5-build-backend/changes.md.
   Answer DEPLOY to deploy it to {{dev_env}}, or SKIP to leave {{dev_env}} alone
   and go straight to the frontend build.
   SKIP means the frontend will be built against whatever is already deployed —
   say that in the question so the choice is informed. The question must name
   both answers exactly as the edges are named.
   input:  5-build-backend/changes.md
   output: 6-confirm-deploy/decision.md
   DEPLOY -> deploy-backend
   SKIP   -> build-frontend

7. deploy-backend  (general-purpose)
   Deploy the backend to {{dev_env}} the way the repo itself deploys — work the
   command out from its scripts, CI config or README, and record which one you
   used and why. Only {{dev_env}} — never staging, never prod, whatever the repo
   scripts offer.
   Record the command, the target, the resulting base URL and the deploy log.
   If the deploy itself fails, record the error verbatim and still return DONE:
   verify-backend is the single gate, so there is exactly one retry counter for
   the whole build/deploy/verify cycle.
   workDir: {{backend_path}}
   input:  5-build-backend/changes.md, 6-confirm-deploy/decision.md
   output: 7-deploy-backend/deployment.md
   DONE -> confirm-verify

8. confirm-verify  (human)
   The verification gate, after the deploy. Ask: the backend is deployed — read
   7-deploy-backend/deployment.md. Answer VERIFY to have a smoke script written
   and run against it, or SKIP to go straight to the frontend build.
   Show the deploy's own reported status in the question, so a human looking at
   a failed deploy is not asked blind. The question must name both answers
   exactly as the edges are named.
   input:  7-deploy-backend/deployment.md
   output: 8-confirm-verify/decision.md
   VERIFY -> verify-backend
   SKIP   -> build-frontend

9. verify-backend  (general-purpose)
   Run a quick check against the deployed base URL from deployment.md: health,
   then the endpoints the backend plan added, against the ticket's acceptance
   criteria. If the repo already has a smoke or health check for {{dev_env}},
   use it; otherwise write a small one from the acceptance criteria and save it
   with the results.
   Record the command, each check, and the failure output verbatim.
   PASS when every check passes. FAIL otherwise, and the file must say what the
   failure suggests the cause is — that diagnosis is what build-backend reads
   on the retry. Name both events in the prompt, and say there are at most three
   attempts, after which the run goes to the PR gate with the backend still
   broken and the human decides what to do with it.
   Never edit backend code here, and never call a check passed that did not run.
   workDir: {{backend_path}}
   input:  7-deploy-backend/deployment.md, 5-build-backend/changes.md,
           4-plan-implementation/backend-plan.md
   output: 9-verify-backend/verification.md
   PASS -> build-frontend
   FAIL -> build-backend, max 3, onMax confirm-pr

   (build-frontend is reached three ways — SKIP at the deploy gate, SKIP at the
   verify gate, or PASS here — so it runs once, whichever way the run got there.)

10. build-frontend  (general-purpose)
    Implement the frontend plan in {{frontend_path}} against the contract in the
    plan and, if a deploy happened, the base URL in deployment.md — the frontend
    talks to the deployed {{dev_env}} backend, not to a mock. If the deploy was
    skipped, say so in the changes file and build against the environment as it
    stands. Same discipline: plan only, nothing else.
    Then build the app and record whether the build succeeded.
    On a retry pass, read 14-test-frontend/results.md and fix what failed.
    workDir: {{frontend_path}}
    input:  4-plan-implementation/frontend-plan.md
    output: 10-build-frontend/changes.md
    DONE -> confirm-browser-test

11. confirm-browser-test  (human)
    The browser-test gate. Ask: the frontend is built — read
    10-build-frontend/changes.md. Answer TEST to start the app locally and drive
    the feature in a real browser, or SKIP to go straight to the PR gate.
    Say in the question that TEST means starting a dev server and logging in by
    hand, and that SKIP leaves the feature untested in the browser. The question
    must name both answers exactly as the edges are named.
    input:  10-build-frontend/changes.md
    output: 11-confirm-browser-test/decision.md
    TEST -> serve-local
    SKIP -> confirm-pr

12. serve-local  (general-purpose)
    Start the frontend dev server on {{local_port}}, pointed at the {{dev_env}}
    backend, in the background so it outlives this step. Wait until it actually
    answers, then open it in the Playwright MCP browser so the human has a
    window to log into.
    Record the local URL, the backend URL it is configured against, the browser
    session or profile the test step must reuse, and how to stop the server.
    workDir: {{frontend_path}}
    input:  10-build-frontend/changes.md
    output: 12-serve-local/server.md
    DONE -> confirm-login

13. confirm-login  (human)
    Ask: the app is at http://localhost:{{local_port}} in the Playwright
    browser — log in, then answer READY. Answer RESTART if the app does not
    start or you cannot log in.
    The question must name both answers exactly as the edges are named.
    input:  12-serve-local/server.md
    output: 13-confirm-login/decision.md
    READY   -> test-frontend
    RESTART -> serve-local, max 2, onMax confirm-pr

14. test-frontend  (general-purpose)
    Drive the feature end-to-end with the Playwright MCP, in the SAME browser
    session the human logged into — reuse the session from server.md, never
    open a fresh context, and never log in from a script or handle credentials.
    Walk the ticket's acceptance criteria one at a time against the real
    {{dev_env}} backend. Record per criterion: the steps, what was observed, a
    screenshot, and pass/fail. Check the network calls hit the deployed backend
    and not a mock.
    PASS only when every acceptance criterion passes. FAIL otherwise, with the
    failing criterion and whether it looks like a frontend or a backend fault.
    Name both events, and say there are at most two frontend retries, after
    which the run goes to the PR gate with the failures on record.
    workDir: {{frontend_path}}
    input:  13-confirm-login/decision.md, 12-serve-local/server.md,
            1-fetch-ticket/ticket.md, 4-plan-implementation/frontend-plan.md
    output: 14-test-frontend/results.md
    PASS -> confirm-pr
    FAIL -> build-frontend, max 2, onMax confirm-pr

15. confirm-pr  (human)
    The last gate. Ask: the work is done — answer OPEN to push the branches and
    open the pull requests, or SKIP to end the run and leave the changes
    uncommitted.
    The question must summarise what was actually verified: whether the backend
    was deployed, whether it was verified, whether the browser tests ran and
    passed. Read that from the decision and result files rather than assuming —
    a human approving a PR should see what was skipped. The question must name
    both answers exactly as the edges are named.
    input:  5-build-backend/changes.md, 10-build-frontend/changes.md,
            6-confirm-deploy/decision.md, 8-confirm-verify/decision.md,
            11-confirm-browser-test/decision.md
    output: 15-confirm-pr/decision.md
    OPEN -> open-pr
    SKIP -> END

16. open-pr  (general-purpose)
    For each repo that actually changed, create branch
    {{branch_prefix}}/{{ticket}} off its current default branch, stage only the
    files listed in that repo's changes file, commit, push, and open a PR with
    gh. A repo with no changes gets no PR.
    Each PR body states the ticket, the plan item each change serves, and a
    "What was verified" section built from the decision and result files:
    deployed or skipped, verified or skipped, browser-tested or skipped, and any
    failure that was left unresolved. If anything was skipped or failed, open
    the PR as a draft and say why in the first line of the body.
    Hard rules for the prompt: never commit or push to a default branch; never
    stage a file that is not in the changes list; never amend or force-push; and
    the commit message and PR body must not mention any AI tool, assistant or
    co-author. If a working tree holds unrelated modifications, leave them
    unstaged.
    Record each branch, commit and PR URL.
    input:  15-confirm-pr/decision.md, 5-build-backend/changes.md,
            10-build-frontend/changes.md, 9-verify-backend/verification.md,
            14-test-frontend/results.md
    output: 16-open-pr/pr.md
    DONE -> END

ALSO
- Give each agent step a short system prompt (`system`): ticket clerk who copies rather than
  summarises / two investigators who prove claims with file:line and write no
  code / architect who pins one API contract for both sides / backend engineer
  who implements the plan and runs only the tests for what they touched /
  release hand who deploys only to the named environment / verifier who reports
  what happened and never edits code to make a check pass / frontend engineer
  who builds against the deployed backend / operator who starts a server and
  proves it answers / QA who tests what the ticket asked for through the UI a
  real user sees / release hand who pushes only what the changes files list.
- Write knowledge stubs for all eleven agent steps; the five human steps get
  none. The scout stubs should say what a file:line-proven claim is and how to
  map services to their test files; the plan stub should say what an API
  contract has to pin down; the build-backend stub should say how to pick the
  scoped test set and what makes running the full suite the wrong call; the
  verify stub should say what a quick check covers and what it does not; the
  serve-local and test-frontend stubs should carry the Playwright MCP session
  rules; the open-pr stub should carry the git rules and the "What was verified"
  body format.
- Note in the pipeline that the five human steps are the point, not overhead:
  each one has a skip that moves the run on, so the pipeline never blocks on
  work the human already knows is unnecessary.
- Validate until it reports zero errors and zero warnings.
