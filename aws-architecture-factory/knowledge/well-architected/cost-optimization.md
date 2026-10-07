# Well-Architected Pillar: Cost Optimization

Official framework: https://docs.aws.amazon.com/wellarchitected/latest/framework/
Pillars overview: https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html

Decision-quality review: does the cost shape fit the workload and the budget driver, and are there scenarios where cost grows without bound? This is not an exact bill; see `../output/cost-model.md`. Tie findings to a component and a driver (budget, traffic, growth, team).

## Design principles
- Implement cloud financial management: someone owns cost.
- Adopt a consumption model: pay for what is used.
- Measure overall efficiency (cost per business outcome).
- Stop spending on undifferentiated heavy lifting.
- Analyze and attribute expenditure (tags, accounts, per-feature cost).

## Key review questions
| Area | Ask |
|---|---|
| Cost shape | For each service, what does the bill scale with: requests, provisioned hours, data, transfer? |
| Load scenarios | What is the cost at normal, peak and 10x growth? Where does the shape cross over (for example Lambda vs containers)? |
| Fixed floors | Which components cost money at zero traffic (NAT Gateway, load balancers, provisioned capacity, Multi-AZ databases)? |
| Data movement | Cross-AZ, cross-region, internet egress and NAT data processing volumes? |
| Observability spend | Log volume, retention, custom metrics, trace sampling? |
| Unbounded paths | Can a retry loop, a bad actor or a bug drive spend with no cap? Budgets, alarms, throttles? |
| Lifecycle | Do S3 lifecycle rules, TTLs and retention limit storage growth? |
| Commitments | Is any Savings Plan or reserved capacity justified by stable usage, or premature? |
| Ownership | Are resources tagged so cost can be attributed? |

## Common AWS anti-patterns
- NAT Gateway carrying high-volume traffic to S3 or DynamoDB that a gateway endpoint would handle.
- Debug-level logs at production volume with unlimited retention.
- Always-on provisioned capacity for a bursty, low-utilization workload.
- Serverless chosen for sustained high utilization without checking cost at that load.
- Unbounded retries on a paid downstream.
- No S3 lifecycle policy; versioned buckets that only grow.
- Cross-AZ chatter between tightly coupled components.

## What a high risk looks like
- An unbounded cost scenario with no cap, alarm or throttle.
- Estimated cost at expected peak or 10x growth exceeds the budget driver.
- A fixed monthly floor that is large relative to the budget at low traffic.
- Cost model rests on a high-impact, low-confidence assumption with no sensitivity range.

Medium: cost within budget but no attribution or alarms; cheaper option exists with a minor trade-off.

## Reviewer reminders
- Quote ranges, not point prices. Name the pricing page, region and date.
- Cost is one driver among several; do not recommend a cheaper design that breaks another driver.
