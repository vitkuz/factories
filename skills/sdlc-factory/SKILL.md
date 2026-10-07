---
name: sdlc-factory
description: "Runs one feature through a ten-role SDLC line (consulting, product, design, architecture, engineering, data, infra, security, QA, delivery), each role writing one artefact for the next, stopping at the first hard stop, then builds an evidence pack (seams, human gates, eval, cost, risk, recommendation) for a person to confirm. Only run it when the user invokes it by name, never on your own initiative."
allowed-tools: Read, Write, Glob, Task, AskUserQuestion, Bash, Skill
---

# sdlc-factory

This factory is a decoration of the universal `any-factory` skill. Its graph
lives at `factories/sdlc-factory/pipeline.json`; nothing here is run
directly.

Invoke the `any-factory` skill (Skill tool) with args:

    sdlc-factory $ARGUMENTS

If the Skill tool is unavailable, read `.claude/skills/any-factory/SKILL.md`
and follow it with pipeline id `sdlc-factory`.
