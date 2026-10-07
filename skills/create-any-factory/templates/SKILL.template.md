---
name: <<PIPELINE_ID>>
description: "<<DESCRIPTION>> Only run it when the user invokes it by name, never on your own initiative."
allowed-tools: Read, Write, Glob, Task, AskUserQuestion, Bash, Skill
---

# <<PIPELINE_ID>>

This factory is a decoration of the universal `any-factory` skill. Its graph
lives at `<<FACTORY_DIR>>/<<PIPELINE_ID>>/pipeline.json`; nothing here is run
directly.

Invoke the `any-factory` skill (Skill tool) with args:

    <<PIPELINE_ID>> $ARGUMENTS

If the Skill tool is unavailable, read `.claude/skills/any-factory/SKILL.md`
and follow it with pipeline id `<<PIPELINE_ID>>`.
