---
name: write-articles-factory
description: "Researches a topic in depth, finds insights, picks the best angles and writes three articles in parallel, then fact-checks, edits, humanizes and packages them. Only run it when the user invokes it by name, never on your own initiative."
allowed-tools: Read, Write, Glob, Task, AskUserQuestion, Bash, Skill
---

# write-articles-factory

This factory is a decoration of the universal `any-factory` skill. Its graph
lives at `factories/write-articles-factory/pipeline.json`; nothing here is run
directly.

Invoke the `any-factory` skill (Skill tool) with args:

    write-articles-factory $ARGUMENTS

If the Skill tool is unavailable, read `.claude/skills/any-factory/SKILL.md`
and follow it with pipeline id `write-articles-factory`.
