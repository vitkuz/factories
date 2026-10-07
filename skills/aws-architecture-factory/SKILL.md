---
name: aws-architecture-factory
description: "Turns a natural-language system idea into an evidence-backed AWS architecture: drivers, hypotheses, AWS research, competing candidates, trade-offs, Well-Architected review, red team, a capped revision loop, then ADRs, cost model, Mermaid diagrams and a final report. Only run it when the user invokes it by name, never on your own initiative."
allowed-tools: Read, Write, Glob, Task, AskUserQuestion, Bash, Skill
---

# aws-architecture-factory

This factory is a decoration of the universal `any-factory` skill. Its graph
lives at `factories/aws-architecture-factory/pipeline.json`; nothing here is run
directly.

Invoke the `any-factory` skill (Skill tool) with args:

    aws-architecture-factory $ARGUMENTS

If the Skill tool is unavailable, read `.claude/skills/any-factory/SKILL.md`
and follow it with pipeline id `aws-architecture-factory`.
