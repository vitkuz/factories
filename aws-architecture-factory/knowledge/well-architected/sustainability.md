# Well-Architected Pillar: Sustainability

Official framework: https://docs.aws.amazon.com/wellarchitected/latest/framework/
Pillars overview: https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html

Decision-quality review: does the architecture use resources in proportion to the work done, without sacrificing the primary drivers? Sustainability findings are usually medium or low unless a sustainability or regional-policy driver is explicit. Tie findings to a component and a driver.

## Design principles
- Understand your impact: measure workload resource use against business output.
- Establish sustainability goals where the organization has them.
- Maximize utilization; right-size and avoid idle capacity.
- Anticipate and adopt more efficient hardware and software offerings.
- Use managed services that share infrastructure across customers.
- Reduce the downstream impact of the workload (for example, client device work and data transferred).

## Key review questions
| Area | Ask |
|---|---|
| Utilization | Is capacity sized to demand or permanently idle? Can it scale to zero or near zero? |
| Region choice | Does the region choice reflect latency, residency and, where allowed, lower-carbon options? |
| Hardware | Are efficient options (for example Graviton) viable for the runtime? |
| Data | Is data retained longer than needed? Are lifecycle rules, compression and storage classes used? |
| Transfer | Is data moved more than necessary (cross-region replication, repeated downloads, uncompressed payloads)? |
| Processing | Is work batched or asynchronous where latency allows? Any redundant recomputation? |
| Managed services | Are self-managed always-on fleets used where a managed or serverless service would raise utilization? |
| Measurement | Is there any proxy metric (cost, utilization) tracked per unit of business output? |

## Common AWS anti-patterns
- Fixed fleet at peak size around the clock.
- Replicating all data to extra regions with no recovery driver.
- Keeping every log, backup and intermediate artifact forever.
- Polling loops instead of event-driven triggers.
- Re-processing unchanged data on every run.
- Large uncompressed or uncached assets served repeatedly to clients.

## What a high risk looks like
Rarely high. Treat as high only when an explicit sustainability or regulatory driver exists and the design clearly conflicts with it, for example mandated region or carbon target ignored with no justification.

Medium: sustained idle capacity, unbounded data retention, or multi-region copies without a driver.

## Reviewer reminders
- Sustainability overlaps cost and performance; avoid duplicating their findings. Reference them instead.
- Do not trade away reliability or security for sustainability unless a driver says so.
- Keep this review short and concrete; if nothing material is found, say so.
