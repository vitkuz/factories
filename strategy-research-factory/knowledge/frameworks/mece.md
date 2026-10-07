---
id: mece
name: MECE decomposition and issue trees
purpose: Break a broad question into a few mutually exclusive, collectively exhaustive branches, each a distinct uncertainty that evidence can answer.
problemTypes: [problem-structuring, strategic-options]
useWhen:
  - a broad or vague question must be split into parts that can be researched separately
  - several people or agents will work on branches in parallel and must not duplicate work
  - the answer depends on several independent uncertainties and none should be forgotten
doNotUseWhen:
  - the question is already narrow enough to answer directly with one body of evidence
  - the decomposition would be generic categories that do not change what is researched
  - a ready-made framework (profit tree, five forces) already gives the structure for the question
questionsAnswered:
  - What are the distinct questions that together determine the answer?
  - Which part of the question is each branch responsible for, and why does it matter?
  - Does any branch overlap another, and is any part of the question uncovered?
requiredEvidence: [root-question, decision-context, domain-knowledge]
outputs: [issue-tree, branch-questions]
complexity: 2
overlapsWith: [profit-tree]
pairsWellWith: [scenario-planning, unit-economics]
---

## How to apply

1. State the root question so it can be answered yes, no or with a number, and name the decision
   it serves.
2. Pick one way to cut it and use it for the whole level. Common cuts:
   - **by formula**: the answer is a product or sum of parts (profit = revenue - cost);
   - **by process**: steps a thing goes through (acquire, serve, retain);
   - **by stakeholder**: who is affected or decides (buyer, regulator, competitor);
   - **by option**: the alternatives being compared, each with the same criteria.
3. Aim for **3-7 top-level branches**. Fewer than 3 usually means the cut is too coarse; more
   than 7 means two levels are mixed. Never 20+ shallow branches.
4. Test each branch: it must materially change the final answer, be a **distinct
   uncertainty**, and be **answerable through evidence**. Drop or merge any that fail.
5. Run the **overlap test**: for each pair, could one fact legitimately belong under both? If
   yes, redraw the boundary or merge.
6. Run the **gap test**: if every branch were answered with certainty, would the root question
   be answered? If not, name what is missing and add a branch.
7. Add children only where a branch is still too broad to research; keep depth to what the
   decision needs. Do not research the branches while building the tree.

## Output shape

```json
{
  "root": "Should I buy this apartment?",
  "branches": [
    {
      "id": "resale-liquidity",
      "title": "Resale liquidity",
      "question": "How quickly and at what discount could I sell it in 5-10 years?",
      "whyItMatters": "An illiquid asset locks capital and can force a loss sale.",
      "children": []
    }
  ]
}
```

`children` is optional and has the same shape as a branch. Example top level for the apartment
question:

- `resale-liquidity`: time on market and price trend for comparable units.
- `financial-economics`: price against comparables, financing cost, ownership cost, expected return.
- `livability`: noise, light, layout, commute, building condition, neighbourhood.
- `rental-demand`: achievable rent, vacancy, tenant profile, regulation of lettings.
- `future-development`: planned infrastructure, zoning, construction that raises or lowers value.

## Pitfalls

- Generic categories ("pros", "cons", "other") that fit any question and direct no research.
- Duplicated concerns, such as price appearing under both economics and liquidity.
- Mixing cuts in one level (a process step beside a stakeholder).
- A catch-all "other" branch hiding a gap instead of naming it.
- Branches that are topics, not questions, or that cannot be settled by any evidence.
- Over-decomposing: many shallow branches that dilute effort across trivial issues.

## Reading the result

A good tree reads as a plan: each branch names a question, and a reader can say what evidence
would settle it. Rank branches by how much their answer could swing the decision, and spend
effort there first. If one branch dominates the answer, split it further; if several branches
cannot be answered with available evidence, say so before research starts.
