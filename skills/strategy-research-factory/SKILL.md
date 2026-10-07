---
name: strategy-research-factory
description: "Supports a strategic decision: frames it, builds an issue tree and hypotheses, picks frameworks, researches market, customer, competition and environment, tests the hypotheses and writes a reviewed report. Only run it when the user invokes it by name, never on your own initiative."
allowed-tools: Read, Write, Glob, Task, AskUserQuestion, Bash, Skill
---

# strategy-research-factory

This factory is a decoration of the universal `any-factory` skill. Its graph
lives at `factories/strategy-research-factory/pipeline.json`; nothing here is run
directly.

Invoke the `any-factory` skill (Skill tool) with args:

    strategy-research-factory $ARGUMENTS

If the Skill tool is unavailable, read `.claude/skills/any-factory/SKILL.md`
and follow it with pipeline id `strategy-research-factory`.
