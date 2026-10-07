---
name: repurpose-factory
description: "Turns one source (a YouTube video, an article URL or a local file) into a LinkedIn post, an X thread, a blog post, a newsletter issue and a Shorts script: extracts the core once, lets a person check it, writes every platform in parallel, reviews them all against the core, and packages the approved pieces with a posting calendar. Only run it when the user invokes it by name, never on your own initiative."
allowed-tools: Read, Write, Glob, Task, AskUserQuestion, Bash, Skill
---

# repurpose-factory

This factory is a decoration of the universal `any-factory` skill. Its graph
lives at `factories/repurpose-factory/pipeline.json`; nothing here is run
directly.

Invoke the `any-factory` skill (Skill tool) with args:

    repurpose-factory $ARGUMENTS

If the Skill tool is unavailable, read `.claude/skills/any-factory/SKILL.md`
and follow it with pipeline id `repurpose-factory`.
