---
id: first-principles
name: First principles
purpose: Redesign a process, product or system by separating fundamental constraints from inherited conventions and rebuilding options from the fundamentals only.
problemTypes: [solution-redesign, strategic-options]
useWhen:
  - the question asks how something could be redesigned, reinvented or done differently (an INVENT question)
  - current practice looks shaped by habit, legacy or precedent rather than by the goal
  - incremental improvement of the existing design has stopped paying off
doNotUseWhen:
  - the question is to diagnose why an existing result is bad (use a diagnostic framework)
  - the question is to size, measure or compare existing options on known criteria
  - the design space is fixed by regulation or contract and no convention can be questioned
questionsAnswered:
  - What outcome must the redesign achieve, stated independent of today's method?
  - Which current assumptions are fundamental constraints and which are conventions?
  - What options follow if only the fundamentals are kept?
  - What do analogies and prior art say about the rebuilt options?
  - Which experiments would test the riskiest assumptions cheaply?
requiredEvidence: [current-practice, constraint-evidence, prior-art, analogous-domains]
outputs: [goal-statement, labelled-assumptions, fundamentals, rebuilt-options, experiments]
complexity: 3
overlapsWith: [hypothesis-driven]
pairsWellWith: [mece, scenario-planning]
---

## How to apply

1. **State the goal in outcome terms.** Describe what must be true for the people served, not the
   activity performed today. "Teams ship changes with known architectural risk", not "hold a
   review meeting".
2. **List current assumptions and conventions.** Write down how the thing works now and why:
   steps, roles, cadence, tools, artefacts, rules of thumb. Aim for 8 to 15 entries.
3. **Label each entry fundamental or convention.** A fundamental is a constraint of physics, law,
   economics or human limits, and needs evidence (a source, a measurement, a statute). An entry
   with no evidence is a convention until shown otherwise.
4. **Write the fundamentals as a short list.** Each states the constraint, its type, and the
   evidence id. These are the only inputs to the next step.
5. **Rebuild from the fundamentals only.** Generate two to four options that satisfy the goal and
   every fundamental, ignoring the conventions. At least one option should drop a convention
   everyone treats as obvious.
6. **Sanity-check against analogies and prior art.** For each option find where a comparable
   problem was solved this way, or why it failed. Adjust or discard options accordingly.
7. **Propose experiments.** For each option name the riskiest assumption, a cheap test, and what
   result would change the choice.

## Output shape

```yaml
goal: ""
assumptions:
  - { statement:, label: fundamental|convention, evidence: [], note: }
fundamentals:
  - { constraint:, type: physics|law|economics|human-limit, evidence: [] }
options:
  - { name:, description:, conventions-dropped: [], satisfies: [], analogies: [], risks: [] }
risks: []
experiments:
  - { option:, assumption-tested:, test:, decision-rule: }
```

## Pitfalls

- Labelling a convention as fundamental because it is old or universal; require evidence for
  every fundamental.
- Stopping at "the process is inefficient" without rebuilding anything.
- Rebuilding options that quietly reuse the conventions that were just discarded.
- Treating human limits (attention, trust, incentives) as conventions that a tool can remove.
- Novelty for its own sake: an option that breaks a real fundamental is wrong however fresh.
- Skipping prior art and rediscovering a known failure.

## Reading the result

The value is in the assumptions list: the conventions that turn out to carry no evidence are the
openings. Prefer the option that drops the most conventions while still passing the analogy check
and having a cheap experiment. If every assumption survives as fundamental, say so; the current
design is near its limit and the answer is incremental improvement.
