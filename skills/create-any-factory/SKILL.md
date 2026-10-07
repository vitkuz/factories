---
name: create-any-factory
description: Builds a new factory on top of the universal any-factory skill from a description of steps. By default writes a shared factory into the kit (factories/<id>/pipeline.json + factories/skills/<id>/SKILL.md, linked into .claude/skills by install.sh); with local=true writes a project-only factory (factories.local/<id>/ + .claude/skills/<id>/). Then checks the graph with the shared validator. Use when the user wants to create an agent pipeline, a multi-step subagent workflow, a content factory, or asks for /create-any-factory.
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion, Bash
---

# create-any-factory

Your arguments are `$ARGUMENTS`. `local=true` among them means a **local**
factory (this project only); anything else is the description. Default: a
**shared** factory, written into the kit (`factories/` is a git submodule
shared by several projects).

You write three things, nothing else:

```
shared (default)                          local (local=true)
factories/<id>/pipeline.json              factories.local/<id>/pipeline.json      the graph
factories/<id>/knowledge/*.md             factories.local/<id>/knowledge/*.md     reference files (only if needed)
factories/skills/<id>/SKILL.md            .claude/skills/<id>/SKILL.md            the wrapper, from the template
```

Running and state belong to the `any-factory` skill, validation to
`factories/bin/validate.mjs` — never copy or write tooling. If the kit
(`factories/bin/validate.mjs`) is missing, say so and stop.

## 1. Draft

Read [example-pipeline.json](example-pipeline.json) and the field tables in
[runner.md](../any-factory/runner.md). Per step: name, agent, model, job, input,
output, events. Show a diagram and a step table; ask (one AskUserQuestion) only
what you cannot infer. Vague goal → ask for the steps first. Say which kind you
are writing (shared or local) and why.

## 2. Write

Either directory exists (in `factories/`, `factories.local/` or
`.claude/skills/`) → stop and ask. `CLAUDE_SKILL_DIR` is this skill's base
directory, printed when the skill loads.

Shared:

```bash
mkdir -p factories/<id> factories/skills/<id>
cp ${CLAUDE_SKILL_DIR}/templates/SKILL.template.md factories/skills/<id>/SKILL.md
sed -i 's/<<PIPELINE_ID>>/<id>/g; s#<<FACTORY_DIR>>#factories#g' factories/skills/<id>/SKILL.md
bash factories/install.sh          # links .claude/skills/<id> -> ../../factories/skills/<id>
```

Local:

```bash
mkdir -p factories.local/<id> .claude/skills/<id>
cp ${CLAUDE_SKILL_DIR}/templates/SKILL.template.md .claude/skills/<id>/SKILL.md
sed -i 's/<<PIPELINE_ID>>/<id>/g; s#<<FACTORY_DIR>>#factories.local#g' .claude/skills/<id>/SKILL.md
```

Replace `<<DESCRIPTION>>` with the pipeline's `description`. Change nothing else
in the wrapper.

Write `pipeline.json` and every `knowledge` file it names — a stub beats a
missing path. The first key is `"$schema"`: `"../pipeline.schema.json"` for a
shared factory, `"../../factories/pipeline.schema.json"` for a local one.

## 3. Check

```bash
node factories/bin/validate.mjs <id>
grep -c '<<' <wrapper SKILL.md>            # 0
```

Fix every error; act on every warning or say why not.

## 4. Report

What it does in one line, the diagram and step table, the command to run it
with a plausible param, where output lands, validator counts, and what to
commit:

- shared: `cd factories && git add <id> skills/<id> && git commit && git push`,
  then in the project `git add factories .claude/skills/<id>` (the submodule
  pointer and the symlink) and commit; other projects get it with
  `git submodule update --remote factories && bash factories/install.sh`.
- local: commit `factories.local/<id>` and `.claude/skills/<id>` in the project.

If `/<id>` is not recognised yet, start a new session.

## Rules for pipeline.json

- **`id`** ends in `-factory` (`fetch-ticket-factory`). Step names are kebab-case actions (`write-draft`), no postfix.
- **`constants`** open with `"rootPath": "cwd"`, `"skillPath": "."`, `"homePath": "~"`, then `"factoryPath": "{{rootPath}}/factories/{{id}}"` (local: `"{{rootPath}}/factories.local/{{id}}"`) — exactly these values.
- **`outputDir`** = `"{{rootPath}}/run/{{id}}/{{slug}}-{{date}}"`.
- **`hooks`** — always these two, then any of your own:
  `"before": ["cp {{factoryPath}}/pipeline.json {{outputDir}}/pipeline.json"]`,
  `"after": ["bash {{rootPath}}/factories/scripts/ai-usage-ingest.sh {{outputDir}}"]`.
  A hook script lives in `factories/scripts/` and must work in any project (exit 0 with a note when its tool is absent).
- **A run never writes inside `factories/` or `factories.local/`.** Anything a run keeps across runs (an insight store, a lessons log) lives at `{{rootPath}}/factory-data/{{id}}/…`; declare the path as a constant and let the steps read and append there. Listed under `knowledge`, a missing file there is only a warning.
- **One job per step.** "and then" in a prompt = two steps.
- **Output folders** are `{n}-{step-name}/`. `input` must be an earlier step's `output`; anything else is anchored on `{{rootPath}}` in the prompt.
- **Events name outcomes** (`DONE`, `APPROVE`/`REVISE`), never the next step. A step that chooses names every event in its prompt.
- **Every loop has a `max`**, usually with `onMax`; say the limit in the prompt too.
- **Fan out** independent steps with a `target` array; they join by pointing at the same next step.
- **`prompt`** = only what changes per run. **`system`** = who the subagent is, a few sentences. **`knowledge`** = standing reference, at `{{factoryPath}}/knowledge/`; copy a file another factory has, never point outside. A knowledge file never names a run folder, step or event. A shared factory's knowledge names no project: project facts go to params or to a file under `factory-data/`.
- **`model`**: `opus` plans, builds, reviews, decides; `sonnet` researches, drafts, tests, deploys; `haiku` fetches, copies, assembles; `fable` only the step that must not be wrong. Unsure → `opus`. Human steps: none.
- **Human steps** where taste, cost or risk matter: the question names every event in `transitions`, and the step has an `output`.
- **Conditions** only when an event cannot express it; leave one edge unconditional.
