# Well-Architected Pillar: Operational Excellence

Official framework: https://docs.aws.amazon.com/wellarchitected/latest/framework/
Pillars overview: https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html

Use this as a decision-quality review of the selected architecture: can the team run, observe and change this system safely? It is not a compliance checklist. Tie every finding to a component and an architecture driver (see `review-output.md`).

## Design principles
- Perform operations as code: infrastructure, deployment and runbooks are versioned and repeatable.
- Make frequent, small, reversible changes.
- Refine operations procedures frequently; learn from failures.
- Anticipate failure; know how it shows up before it happens.
- Observe workload health through metrics, logs and traces that match the business outcome.

## Key review questions
| Area | Ask |
|---|---|
| Ownership | Who is on call for each component, and does the team size and skill set (driver) support that load? |
| Deployment | Can every change be rolled back? How? Is there a canary, alias shift or blue/green path? |
| Observability | Which metrics, alarms and traces show customer impact, not just resource health? |
| Async flows | Are queue depth, message age, retry count and DLQ count alarmed? |
| Correlation | Does one identifier follow a request through every component and log? |
| Runbooks | Does each alarm have an action? Is there a runbook for DLQ drain, replay and failover? |
| Change safety | How are schema and config changes rolled out and reverted? |
| Operational load | Is the number of distinct services proportional to the team's capacity? |

## Common AWS anti-patterns
- Alarms on CPU or invocation count only; nothing on user-visible errors or latency.
- No DLQ, or a DLQ nobody monitors.
- Manual console changes; no infrastructure-as-code.
- Logs with no retention setting or no structured fields.
- Deployments that cannot be rolled back because of in-place schema changes.
- A design needing a platform team (EKS, custom control planes) for a small team with no such skills.
- Unowned shared resources (one table or bus used by many services without a named owner).

## What a high risk looks like
- Failure that would go undetected for hours (no alarm on the main business flow).
- No rollback path for a stateful or schema change.
- Operating burden clearly beyond the stated team size or skills.
- Poison messages or stuck work with no visibility and no replay procedure.

Medium: partial observability (metrics but no tracing), manual but documented runbooks, unclear ownership of a non-critical component.

## Reviewer reminders
- Judge against the stated drivers. A prototype needs less operational rigor than a regulated production system.
- Name the missing signal or procedure; do not redesign the architecture.
- Check that every selected service has an explicit operational owner role.
