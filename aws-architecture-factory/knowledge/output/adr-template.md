# ADR Template

Every material architecture decision becomes one Architecture Decision Record.

## Template

```markdown
# ADR-XXX — Decision

## Status
Accepted

## Context

## Architecture Drivers

## Considered Options

## Decision

## Why

## Consequences

## Risks

## Revisit When
```

## Guidance

### One ADR per material decision
- A decision is material if reversing it later is costly or it shapes other components: compute model, primary data store, integration style, tenancy, network boundary, identity approach, multi-region stance.
- Do not write an ADR for incidental choices (a log retention number, a naming rule).
- One decision per file. If the text needs "and", split it.

### Numbering and naming
- Sequential, zero-padded: `ADR-001`, `ADR-002`, ...
- File name: `ADR-001-compute.md` (number plus short topic).
- Never reuse a number. A reversed decision gets a new ADR with status `Superseded by ADR-0NN`.

### Status values
`Proposed`, `Accepted`, `Superseded by ADR-0NN`, `Deprecated`.

### Section guidance
| Section | Write |
|---|---|
| Context | The situation and the forces at play, in a few sentences. |
| Architecture Drivers | The specific drivers this decision serves, quoted from the drivers file (for example "peak 2k req/s", "team of 3"). Every ADR maps to at least one driver. |
| Considered Options | Each real option, including the candidates that were rejected, with one line on each. |
| Decision | The chosen option and the AWS services involved, each with its role. |
| Why | Reasoning tied to drivers and cited evidence. State the falsifiers that would reverse the decision. |
| Consequences | What becomes easier, harder or fixed. Include operational and cost consequences. |
| Risks | Open risks from the risk register that relate to this decision, by id. |
| Revisit When | Concrete, measurable triggers. |

### Revisit When: be concrete
Good:
- "Sustained utilization above 60% for 30 days makes Fargate cheaper than Lambda."
- "Job duration approaches 10 minutes."
- "Tenant count exceeds 500 or one tenant exceeds 20% of traffic."

Bad: "If requirements change", "when scale increases", "periodically".

### Quality checks
- Each ADR names at least one driver and at least one rejected alternative.
- Consequences include one negative item. No decision is free.
- The ADR matches the selected architecture; no service appears that the architecture does not contain.
