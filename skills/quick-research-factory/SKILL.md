---
name: quick-research-factory
description: "Answers one research question fast: frames it, researches the web, writes a short report, reviews it (with a bounded revise loop) and finalizes it. Only run it when the user invokes it by name, never on your own initiative."
allowed-tools: Read, Write, Glob, Task, AskUserQuestion, Bash, Skill
---

# quick-research-factory

This factory is a decoration of the universal `any-factory` skill. Its graph
lives at `factories/quick-research-factory/pipeline.json`; nothing here is run
directly.

Invoke the `any-factory` skill (Skill tool) with args:

    quick-research-factory $ARGUMENTS

If the Skill tool is unavailable, read `.claude/skills/any-factory/SKILL.md`
and follow it with pipeline id `quick-research-factory`.
