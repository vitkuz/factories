---
name: adaptive-research-factory
description: "Takes any question, classifies the problem, picks a reasoning framework, builds an issue tree and testable hypotheses, ranks them, researches the top ones on the web with a method, plan and queries per hypothesis, evaluates them, turns facts into insights and implications, writes a decision-oriented recommendation and saves reusable insights for future runs. Only run it when the user invokes it by name, never on your own initiative."
allowed-tools: Read, Write, Glob, Task, AskUserQuestion, Bash, Skill
---

# adaptive-research-factory

This factory is a decoration of the universal `any-factory` skill. Its graph
lives at `factories/adaptive-research-factory/pipeline.json`; nothing here is run
directly.

Invoke the `any-factory` skill (Skill tool) with args:

    adaptive-research-factory $ARGUMENTS

If the Skill tool is unavailable, read `.claude/skills/any-factory/SKILL.md`
and follow it with pipeline id `adaptive-research-factory`.
