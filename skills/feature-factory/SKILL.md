---
name: feature-factory
description: "Builds any feature the user asks for in an AWS project laid out as repos/back, repos/front, repos/tools and repos/docs with its spec in docs/context, back first: brief, parallel scouting, questions, an approved plan, spec first, then implement, deploy (dev, automatic, stops on danger) and test the back until it works, recording the API as built; then build the front locally against it, test it in a browser (fixing front or back), deploy the front, smoke-test, update docs, report and keep lessons. Only run it when the user invokes it by name, never on your own initiative."
allowed-tools: Read, Write, Glob, Task, AskUserQuestion, Bash, Skill
---

# feature-factory

This factory is a decoration of the universal `any-factory` skill. Its graph
lives at `factories/feature-factory/pipeline.json`; nothing here is run
directly.

Invoke the `any-factory` skill (Skill tool) with args:

    feature-factory $ARGUMENTS

The project-specific values are params: `tenant`, `project`, `awsAccount`
(asked when not given), `awsProfile` (default `default`), `awsRegion`. A
project that runs this factory often keeps a real `.claude/skills/feature-factory/`
of its own (install.sh then leaves it alone) that passes them, e.g.
`feature-factory tenant=acme project=shop awsAccount=<account id> awsProfile=work $ARGUMENTS`.
The project map the steps read first lives at `factory-data/feature-factory/project-map.md`
(template: `factories/feature-factory/knowledge/project/project-map.template.md`); the lessons
log at `factory-data/feature-factory/lessons.md` grows with every run.

If the Skill tool is unavailable, read `.claude/skills/any-factory/SKILL.md`
and follow it with pipeline id `feature-factory`.
