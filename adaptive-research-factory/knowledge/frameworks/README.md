# Framework registry

Consulting frameworks as data. Each `<id>.md` is one framework: YAML frontmatter (the metadata)
and a Markdown body (how to apply it). The pipeline never lists frameworks anywhere else.

## How a run uses this folder

1. Before the first step, `scripts/frameworks/build-index.py` reads **only the frontmatter** of
   every file and writes two files into the run folder:
   - `framework-vocabulary.yaml` — every problem type and the framework ids that serve it.
   - `framework-index.yaml` — the vocabulary plus each framework's metadata. No bodies.
2. The sub-problem classifier reads the vocabulary. The router reads the index and selects ids.
3. Only the steps that apply a framework open its body, and only for ids the router selected
   (`loadList` in the framework selection).

A malformed file stops the run before any agent starts, with the file name and the error.

## Adding a framework

Add one file, `knowledge/frameworks/<id>.md`. Nothing else changes: no pipeline edit, no list to
update. The id must equal the file name.

```markdown
---
id: vrio
name: VRIO
purpose: Test whether a resource or capability is a source of sustained competitive advantage.
problemTypes: [competitive-position, capability-fit]   # reuse existing types first
useWhen:
  - judging whether a capability the company has can be defended
doNotUseWhen:
  - the question is about the market, not the company
questionsAnswered:
  - Is the resource valuable, rare, costly to imitate, and exploited by the organisation?
requiredEvidence: [company-capabilities, competitor-capabilities, imitation-cost]
outputs: [advantage-assessment]
complexity: 2            # 1 (a quick 2x2) to 5 (a multi-part model)
overlapsWith: [value-chain]
pairsWellWith: [three-cs]
---

## How to apply
...
## Output shape
...
## Pitfalls
...
## Reading the result
...
```

The fields are defined in `_schema.json`. Check a new file without running a pipeline:

```bash
python3 scripts/frameworks/build-index.py knowledge/frameworks /tmp/fw-check
```

## Rules for a good entry

- **`problemTypes` are the retrieval key.** Reuse the vocabulary before coining a type; a type
  only one framework uses is fine, a synonym of an existing type is not.
- **`doNotUseWhen` is a hard filter.** Write it as situations, concretely enough that a router
  can match a sub-problem against it.
- **`complexity` is honest.** It is what makes the router prefer a 2x2 over a model when both
  answer the question.
- **The body is for the analyst, the frontmatter for the router.** Keep the frontmatter short:
  every line of it is paid for in every run.
- Files starting with `_` and this README are not frameworks and are never indexed.
