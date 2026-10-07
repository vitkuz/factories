/create-any-factory bugfix-factory

Build a pipeline that takes a bug report, finds the cause in the codebase,
fixes it, runs only the tests the fix affects, and opens a pull request on its
own branch. Four steps, one capped retry loop. It works on a real repository,
so it must be conservative: no speculative fixes, no unrelated changes, no push
to the base branch.

PARAMS
- bug            the bug: a description, a stack trace, or an issue reference.
  No useful default — ask if missing.
- base_branch    branch the fix is based on and the PR targets. Default: "main".
- branch_prefix  prefix for the fix branch; the branch is
  {{branch_prefix}}/{{slug}}. Default: "fix".
- test_command   how to run the test suite, e.g. "npm test" or "pytest".
  Default: "" — empty means the step works it out from the repo itself.

CONSTANTS
- rootPath  .
- format    markdown

THE CODEBASE IS NOT `input`
The repository lives outside the run folder, so it is never a step `input` — an
`input` has to be some earlier step's `output`. Steps reach the code by
anchoring on {{rootPath}} in their prompts. Give `fix-bug` and `run-tests`
"workDir": "{{rootPath}}" so they may actually modify the working tree; the
other two steps only read.

STEPS

1. scout-bug  (general-purpose)
   Investigate {{bug}} in the repo at {{rootPath}} and locate the cause. Read
   the code, the tests and the git history around it. This step is allowed to
   spawn its own subagents to search several parts of the tree in parallel —
   say so in the prompt — and it collects what they find into one report.
   The report names the failing behaviour, the exact file:line of the cause,
   why it happens, the blast radius, and which existing tests cover that code.
   It fixes nothing.
   Two outcomes: FOUND when the cause is pinned to specific lines, NOT_FOUND
   when it is not. NOT_FOUND ends the run — a builder handed a guess writes a
   guess. Name both events in the prompt.
   output: 1-scout-bug/report.md
   FOUND     -> fix-bug
   NOT_FOUND -> END

2. fix-bug  (general-purpose)
   Apply the smallest fix that addresses the cause named in the report. Nothing
   else: no refactors, no formatting, no drive-by cleanups, no dependency bumps.
   Add or adjust a test that fails before the fix and passes after it.
   Write a changes file listing every file touched, the reason for each, and
   which test files cover them — `run-tests` and `open-pr` both read it, so it
   has to be accurate.
   On a retry pass, read 3-run-tests/results.md and fix what actually failed;
   do not start over.
   Write it in {{format}}.
   workDir: {{rootPath}}
   input:  1-scout-bug/report.md
   output: 2-fix-bug/changes.md
   DONE -> run-tests

3. run-tests  (general-purpose)
   Run ONLY the tests that the fix affects — the test files listed in
   2-fix-bug/changes.md plus the tests the scout report named as covering the
   changed code. Not the whole suite. Use {{test_command}}; if it is empty,
   work the runner out from the repo and record the command you used.
   Record the exact command, the tests selected, and pass/fail per test with
   the failure output verbatim.
   PASS when every selected test passes, FAIL otherwise. Name both events in
   the prompt. Two retries, then the run ends with the tests still red — say
   that in the prompt, and never open a PR on a red suite.
   workDir: {{rootPath}}
   input:  2-fix-bug/changes.md, 1-scout-bug/report.md
   output: 3-run-tests/results.md
   PASS -> open-pr
   FAIL -> fix-bug, max 2, onMax END

4. open-pr  (general-purpose)
   Create branch {{branch_prefix}}/{{slug}} off {{base_branch}}, stage only the
   files listed in 2-fix-bug/changes.md, commit, push, and open a PR against
   {{base_branch}} with gh. The PR body explains the cause from the scout
   report, the fix, and the tests that were run.
   Hard rules for the prompt: never commit or push to {{base_branch}}; never
   stage a file that is not in the changes list; never amend or force-push; and
   the commit message and PR body must not mention any AI tool, assistant or
   co-author. If the working tree holds unrelated modifications, leave them
   unstaged.
   Record the branch, commit and PR URL.
   input:  2-fix-bug/changes.md, 3-run-tests/results.md, 1-scout-bug/report.md
   output: 4-open-pr/pr.md
   DONE -> END

ALSO
- Give each step a short system prompt (`system`): investigator who proves the cause before
  naming it / surgeon who changes as little as possible / test runner who
  reports what happened and never edits code to make a test pass / release
  hand who touches only what the changes file lists.
- Write knowledge stubs for all four steps. The scout stub should say what
  counts as a proven cause versus a hunch; the fix-bug stub should say what
  "smallest fix" rules out; the run-tests stub should say how to select the
  affected tests; the open-pr stub should carry the git and PR-body rules.
- Validate until it reports zero errors and zero warnings.
