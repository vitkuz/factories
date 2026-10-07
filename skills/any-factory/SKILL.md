---
name: any-factory
description: Runs any factory pipeline by id — `/any-factory <id> name=value ...` — from its graph at factories.local/<id>/pipeline.json (the project's own) or factories/<id>/pipeline.json (the shared kit), with the shared runner, validator and run recorder. Only run it when the user invokes it, or when a factory wrapper skill (/<id>) hands off to it; never on your own initiative.
allowed-tools: Read, Write, Glob, Task, AskUserQuestion, Bash
---

# Run a factory pipeline

Your arguments are `$ARGUMENTS`. The first, `$0`, is the pipeline **id**;
the rest are `name=value` overrides for its `params` (keep quoted values verbatim).
A literal `$0` means no id was given.

1. **Find the pipeline** — `factories.local/<id>/pipeline.json` (the project's
   own factory wins), else `factories/<id>/pipeline.json` (the shared kit), under
   the project root. Missing or no id → list the ids and stop (or ask which one);
   never guess:

       node factories/bin/validate.mjs     # no id: prints every id, exit 2

2. **Check the workspace** — for each repository the pipeline works in, run
   `git -C <repo> branch --show-current` and `git -C <repo> status --porcelain`.
   Uncommitted changes → show them and ask whether to proceed. Never switch,
   stash or discard anything.

3. **Read [runner.md](runner.md) and execute the pipeline** with the
   `name=value` overrides.
