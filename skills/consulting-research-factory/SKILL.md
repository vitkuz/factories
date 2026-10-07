---
name: consulting-research-factory
description: "Turns a topic into an executive consulting report: problem frame, issue tree, an approved research plan, parallel research, evidence base, insights, storyline, exhibits and a partner review. Only run it when the user invokes it by name, never on your own initiative."
allowed-tools: Read, Write, Glob, Task, AskUserQuestion, Bash, Skill
---

# consulting-research-factory

This factory is a decoration of the universal `any-factory` skill. Its graph
lives at `factories/consulting-research-factory/pipeline.json`; nothing here is run
directly.

Invoke the `any-factory` skill (Skill tool) with args:

    consulting-research-factory $ARGUMENTS

If the Skill tool is unavailable, read `.claude/skills/any-factory/SKILL.md`
and follow it with pipeline id `consulting-research-factory`.
