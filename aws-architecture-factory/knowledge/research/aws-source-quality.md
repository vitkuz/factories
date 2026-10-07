# AWS Source Quality

Architecture decisions depend on service constraints. Constraints change, so every material one needs a traceable, dated source.

## Evidence hierarchy

Prefer sources in this order. Use a lower tier only when higher tiers cannot answer.

| Tier | Source | `sourceType` value |
|---|---|---|
| 1 | AWS service documentation | `AWS_DOCS` |
| 2 | AWS Well-Architected documentation | `AWS_WELL_ARCHITECTED` |
| 3 | AWS Architecture Center | `AWS_ARCHITECTURE_CENTER` |
| 4 | AWS Prescriptive Guidance | `AWS_PRESCRIPTIVE_GUIDANCE` |
| 5 | AWS service quotas and pricing pages | `AWS_QUOTAS_PRICING` |
| 6 | Official AWS blogs | `AWS_BLOG` |
| 7 | High-quality independent engineering evidence | `INDEPENDENT_ENGINEERING` |
| 8 | Community evidence (only when primary documentation is insufficient) | `COMMUNITY` |

Rules:
- A higher tier wins when sources conflict. Record the conflict.
- Blogs can be older than the docs. If a blog contradicts current documentation, trust the documentation.
- Community evidence is never enough alone for a one-way decision. Mark confidence LOW.
- Marketing pages are not evidence for a technical constraint.

## Never from memory

- Never quote a limit, quota, timeout, size cap, throughput figure or price from memory. Retrieve it, cite it, date it.
- Limits and prices change and differ by region. Pricing is regional and dated: record the region and the retrieval date.
- A default quota is not a hard limit. Say whether the source calls it adjustable.
- If the figure cannot be retrieved, write "not verified" and treat it as an open uncertainty. Do not guess.
- Statements about service behavior (delivery guarantees, consistency, failure behavior) also need a source.

## Provenance requirements

Every material constraint keeps: the source URL, the date retrieved (ISO-8601), and the source type. A claim without all three is not evidence.

## Evidence item shape

```json
{
  "id": "E-H-COMPUTE-01-03",
  "hypothesisId": "H-COMPUTE-01",
  "claim": "SQS Standard queues provide at-least-once delivery.",
  "constraint": "A message can be delivered more than once.",
  "source": "Amazon SQS Developer Guide, standard queues",
  "url": "https://docs.aws.amazon.com/...",
  "sourceType": "AWS_DOCS",
  "retrievedAt": "2026-10-03T10:15:00Z",
  "confidence": "HIGH",
  "supportsHypothesis": "SUPPORTS",
  "limitations": "Applies to Standard queues; FIFO queues differ."
}
```

| Field | Rule |
|---|---|
| `id` | Unique across the run, tied to the hypothesis. |
| `hypothesisId` | The hypothesis the evidence tests. |
| `claim` | One checkable statement, within what the source says, with number and scope. |
| `constraint` | The architectural constraint the claim creates. |
| `source` | Human-readable source name and section. |
| `url` | The exact page, not a site root. |
| `sourceType` | One value from the table above. |
| `retrievedAt` | ISO-8601 time the page was read. |
| `confidence` | HIGH / MEDIUM / LOW. Tier 1-5 and clearly stated: HIGH. Blogs: MEDIUM. Community: LOW. |
| `supportsHypothesis` | `SUPPORTS`, `CONTRADICTS` or `NEUTRAL`. |
| `limitations` | Region, version, edition, date or condition where the claim may not hold. |

## Quality checks

- Contradicting evidence is recorded with the same care as supporting evidence.
- Each claim could be found by a reader at the cited URL.
- Facts need an implication for the architecture; a constraint with no implication is incomplete.
