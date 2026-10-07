---
id: design-thinking
name: Design Thinking
purpose: Turn unmet user needs into reframed problems and candidate concepts, with cheap experiments that would test them.
problemTypes: [customer-needs, strategic-options, product-market-fit]
useWhen:
  - the question is open-ended: what should we build, offer or change for a group of users
  - the problem is poorly framed and needs reframing before solutions are compared
  - candidate concepts must be generated and then narrowed to a few worth testing
doNotUseWhen:
  - the question is about market size, industry profitability or competitor economics
  - the solution is already chosen and the question is only how to price or fund it
  - no user-voice evidence (reviews, forums, issue trackers, published interviews) can be found
questionsAnswered:
  - What do users struggle with, and what evidence shows it?
  - How can the problem be framed so that it is worth solving?
  - What distinct concepts could address it?
  - Which cheap experiments would show whether a concept is worth pursuing?
requiredEvidence: [product-reviews, forum-and-community-threads, issue-trackers, published-interviews, current-alternatives]
outputs: [user-insights, pov-statements, how-might-we-questions, candidate-concepts, proposed-experiments]
complexity: 3
overlapsWith: [jobs-to-be-done]
pairsWellWith: [customer-journey, customer-segmentation, three-cs]
---

## How to apply

Design thinking is normally run with live users. Here it is adapted to desk research: the
"users" are the voices already published about them.

1. **Empathize.** Mine reviews, forums, issue trackers, community threads and published
   interviews or case studies for the target user. Record what they do, say, struggle with and
   work around. Keep the quote or source for every insight; prefer behaviour (workarounds,
   switching, complaints repeated by many people) over stated wishes.
2. **Define.** Synthesise insights into one **point-of-view statement** per user group:
   "<User> needs a way to <need> because <insight>". Then turn each into **"How might we"**
   questions: neither so broad that nothing follows nor so narrow that the answer is implied.
3. **Ideate.** Diverge first: generate many distinct concepts per question, varying the
   mechanism, not just the wording, and defer judgement. Then converge: cluster, drop
   duplicates, score against the insights (does it address the need?), plausibility and
   effort, and keep a short list.
4. **Prototype and test.** Nothing is built in a desk run. For each shortlisted concept,
   propose the cheapest experiment (landing page, concierge or manual service, paper mock-up,
   interview script, small pilot), and state what result would validate it and what would kill it.
5. **Flag the gap.** State plainly what desk research cannot tell you: latent needs users
   never voice, behaviour that is not published, reactions to something that does not exist
   yet, and the bias of who writes reviews and posts. Mark each insight as observed
   (documented behaviour) or inferred (read between the lines), and name which proposed
   experiments close which gap.

## Output shape

```yaml
insights: [{ user:, insight:, evidence: [], kind: observed|inferred }]
povStatements: [{ user:, need:, because: }]
howMightWe: []
concepts: [{ name:, addresses:, mechanism:, shortlisted: true|false, reason: }]
experiments: [{ concept:, method:, cost:, validatesIf:, killsIf: }]
evidenceGaps: []
```

## Pitfalls

- Treating published opinions as a substitute for interviews; the output is hypotheses to test,
  not validated demand.
- Jumping to solutions before the POV statement and HMW questions are written.
- Converging too early: three variations of one idea are not three concepts.
- Insights without a source, or built from a single loud review.
- Proposing experiments with no stated success or failure criterion.

## Reading the result

Concepts backed by several independent observed insights are strong candidates; concepts resting
on inferred insights only are bets and belong first in the experiment list. If the insights are
thin or contradictory, the finding is that the user need is not yet understood, and the next
step is primary research, not concept selection.
