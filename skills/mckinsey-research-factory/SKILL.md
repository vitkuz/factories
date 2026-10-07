---
name: mckinsey-research-factory
description: "Frames a business question, gets the frame approved by a person, researches market, competitors, economics and operations in parallel, then synthesizes, pressure-tests and writes the report. Only run it when the user invokes it by name, never on your own initiative."
allowed-tools: Read, Write, Glob, Task, AskUserQuestion, Bash, Skill
---

# mckinsey-research-factory

This factory is a decoration of the universal `any-factory` skill. Its graph
lives at `factories/mckinsey-research-factory/pipeline.json`; nothing here is run
directly.

Invoke the `any-factory` skill (Skill tool) with args:

    mckinsey-research-factory $ARGUMENTS

If the Skill tool is unavailable, read `.claude/skills/any-factory/SKILL.md`
and follow it with pipeline id `mckinsey-research-factory`.
