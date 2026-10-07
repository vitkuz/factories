# Reviewing the storyline

Review the storyline before any prose is written. You attack structure and logic, not wording,
and you never rewrite the storyline yourself.

## Checks

1. **Question fit.** Does the governing thought answer the problem statement as asked, for this
   decision maker, against the success criteria?
2. **30-second test.** Can the answer be said from the At a glance alone?
3. **Titles only.** Do the headings alone tell the argument and land on the recommendation? Is
   every one a claim?
4. **Vertical logic.** Does each level answer the question raised by the level above?
5. **Horizontal logic.** Are the groups MECE, of the same kind, 3–5 items, in a stated order?
6. **Evidence under every point.** Is there a point with no ids? Is a key message resting on a
   hypothesis marked rejected or insufficient?
7. **Synthesis fidelity.** Is every message traceable to an insight? Is any message absent from
   the synthesis, or is a major insight missing from the story?
8. **Framework use.** Are framework results used where they answer a message, and not stapled on
   as chapters?
9. **Counter-argument.** Does the story make room for the strongest counter-argument?

## Severity

- **CRITICAL:** answers a different question, or rests the main answer on unsupported evidence.
- **MAJOR:** a broken pyramid, a label heading on a key message, a message the synthesis does not
  carry, a missing counter-argument.
- **MINOR:** ordering and phrasing of subordinate points.

## Deciding the verdict

- **pass:** no CRITICAL or MAJOR finding.
- **revise the storyline:** the synthesis is sound but the storyline misuses it.
- **revise the synthesis:** the problem is underneath the storyline, for example a finding with
  no so-what, a recommendation with no insight, or an insight the evidence does not carry.
- Near the loop cap stated in the task, prefer pass with the open findings listed.

## Shape — `storyline-review.yaml`

```yaml
verdict: pass|revise-storyline|revise-synthesis
why: "<one sentence>"
checks: { questionFit: pass|fail, thirtySecond: ..., titlesOnly: ..., vertical: ..., horizontal: ..., evidence: ..., fidelity: ..., frameworkUse: ..., counterArgument: ... }
findings:
  - { id: S1, severity: CRITICAL|MAJOR|MINOR, where: "<message or point>", problem: "...", fix: "...", for: storyline|synthesis }
openFindings: []      # findings still open when passing at a cap; the report lists these as limitations
```
