# Well-Architected Pillar: Reliability

Official framework: https://docs.aws.amazon.com/wellarchitected/latest/framework/
Pillars overview: https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html

Decision-quality review: does the architecture meet its availability and recovery drivers, and does it fail in a controlled way? Tie findings to a component and a driver (SLA, RTO, RPO, traffic peak).

## Design principles
- Automatically recover from failure.
- Test recovery procedures.
- Scale horizontally to increase aggregate availability.
- Stop guessing capacity.
- Manage change through automation.

## Key review questions
| Area | Ask |
|---|---|
| Failure model | What can fail, how is it detected, what retries, what does the user see? |
| Single points of failure | Which component, AZ or account has no redundancy? Does that match the SLA driver? |
| State | Where is persistent state? Who owns it? Can work be duplicated or lost? |
| Retries | Are retries bounded, with backoff and jitter? Are consumers idempotent? |
| Backpressure | What happens at 10x load? Are quotas, concurrency and throttling limits known? |
| Dependencies | What happens when a downstream or third-party dependency is slow or down? Timeouts, circuit breaking, fallbacks? |
| Recovery | Do backup, restore and failover meet RTO/RPO? Has restore been exercised? |
| Quarantine | Where do poison messages go? How are they inspected and replayed? |
| Regions / AZs | Is multi-AZ in place where the SLA needs it? Is multi-region justified by a driver, not by default? |

## Common AWS anti-patterns
- Queue consumer with no DLQ; or visibility timeout shorter than processing time.
- Lambda concurrency not capped, exhausting a downstream database or account quota.
- Synchronous chains of services with no timeouts.
- Single-AZ database or NAT Gateway for a high-availability driver.
- Backups configured but never restored.
- DynamoDB keys that create hot partitions; unbounded scans in the request path.
- Retries at several layers multiplying load (retry storms).
- Multi-region design with no data replication or failover plan.

## What a high risk looks like
- A single point of failure on the critical path that violates the availability driver.
- A scenario where accepted work is silently lost, or processed twice with harmful side effects.
- No defined failure or retry behavior for an asynchronous flow.
- RTO/RPO drivers with no mechanism that can meet them.
- Overload that cascades into an outage with no throttling or shedding.

Medium: manual failover that probably meets RTO, untested restore, unbounded but low-risk queue growth.

## Reviewer reminders
- Do not demand multi-region unless a driver requires it; name the cost of resilience beyond need.
- Report the failure scenario and its trigger, not a rewritten design.
