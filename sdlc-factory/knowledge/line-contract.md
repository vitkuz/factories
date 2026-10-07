# Line contract (every role)

The SDLC line is ten role subagents in a fixed order:
Consulting / SME → Product / BA → Design → Architecture → Engineering → Data → Infra/Ops →
Security → QA → Management / Delivery. Data runs before Infra/Ops; QA runs near the end so it can
test what Data, Infra/Ops and Security produced. Every output is an artefact the next role reads —
the artefact is the unit of delivery, not the conversation.

## Mode

- One pass per role. No background teams, no parallel autonomous workers, no recursive calls.
- Plan, specify and review only. No live writes, no deployments, no changes to any real system.
- Stay inside the one feature. No portfolio-wide planning, no scope beyond the feature.
- Never ask for or invent secrets, credentials, client-confidential data or production data.

## Do not hand-feed missing context

If you need something your upstream role should have supplied, do not quietly invent it to keep the
line green. Either:

- continue on a **labelled training assumption** (write `ASSUMPTION:` and the text, and name which
  upstream role should have carried the fact), or
- stop, if continuing would require unsafe data, secrets, a live write, a regulated, budget, risk or
  release decision — that is a **hard stop**.

A stall is a finding, not a failure to hide.

## Human gates

You surface human-owned decisions; you never make them. Never accept a risk, choose scope beyond the
feature, approve a budget, a policy, a compliance position or a release. Gate statuses:

| Status | Use when |
|--------|----------|
| `training-open` | A human decision is missing; you continued on a labelled assumption. Blocks production-like use. |
| `hard-stop` | Continuing would require unsafe data, secrets, live writes, regulated approval, budget approval or a release commitment. |
| `missed` | An upstream role continued when it should have paused (record it as a finding). |
| `recorded-open` | Known decision, recorded, not needed to continue the training run. |
| `n/a` | No gate applies. |

## Seam marks

When you read an upstream artefact, judge the handoff:

| Mark | Meaning |
|------|---------|
| `clean` | You got what you needed, nothing more. |
| `under-supply` | Something you needed was missing or too thin. |
| `over-supply` | Upstream made decisions that belong to you or a later role. |
| `missing` | The upstream artefact does not exist. |
| `routing` | The fact exists but arrived via the wrong role or file. |

## Mandatory closing section

End every role artefact with this section:

```
## Handoff notes

- Role: <role name>
- Upstream seams: one line per artefact read — `<artefact> → <mark>: <what happened>`
- Assumptions: each `ASSUMPTION:` you used, and the role that should have supplied it
- Human gates: one line per gate — `<status>: <decision a person must make> — owner: <role or person>`
- Hard stop: `none` or the reason the line must stop here
- Done when: <your role's done-when check> — met / not met
```
