# Failure, Security and Observability Modeling

Every architecture describes these explicitly. Silence on a topic counts as a gap, not as "fine".

## Failure modeling

Answer all nine questions for every architecture. They are mandatory for asynchronous designs.

| Question | What a good answer contains |
|---|---|
| What can fail? | Each component and each dependency, including AWS service throttling and regional events. |
| How is failure detected? | The metric, alarm or health check that fires. |
| What retries? | Which component, how many times, with what backoff. Who bounds the retry. |
| Where is state? | Each piece of persistent state and the component that owns it. |
| Can work be duplicated? | Yes or no, and where duplicates are absorbed (idempotency key, conditional write). |
| Can work be lost? | Yes or no, and the durability point after which loss is impossible. |
| What is the DLQ or quarantine mechanism? | Where poison or exhausted messages go, who looks, how they are replayed. |
| How does recovery happen? | Automatic or manual steps, expected duration against the RTO and RPO drivers. |
| What does the user observe? | Error, delay, partial result, or nothing. |

Rules:
- At-least-once delivery means duplicates are possible; the consumer must be idempotent.
- Every retry loop needs a bound and an exit (a dead-letter queue or quarantine), or it can become a retry storm.
- Check for single points of failure, partial failure between two writes, and dependency failure.

## Security minimums

Cover each item. If an item does not apply, say why in one phrase.

```text
Trust boundaries              Authentication            Authorization
IAM roles                     Least privilege           Secrets
Encryption at rest            Encryption in transit     Public/private network boundaries
Auditability                  PII / sensitive data      Abuse scenarios
Input validation              Service-to-service permissions
```

Guidance:
- Name the trust boundaries first; everything else attaches to them.
- Each component gets its own role with only the actions and resources it needs. A shared broad role is a finding.
- Secrets live in a secrets service, never in code or environment defaults.
- Auditability means identifying which AWS audit logs are on and who can read them.
- Abuse scenarios include unauthenticated flooding, oversized input, and cost abuse.
- Regulated or high-sensitivity workloads can need a deeper threat-model pass; flag it rather than skipping.

## Observability requirements

Identify each of these for the design:

```text
Key metrics            Logs                   Traces               Business KPIs
Alarms                 Dashboards             SLO signals          Failure correlation identifiers
```

For asynchronous flows, consider all of:

| Signal | Why |
|---|---|
| Queue depth | Backlog growth. |
| Message age | Whether consumers keep up; the best early warning. |
| Processing latency | End-to-end and per-stage time. |
| Retry count | Hidden failure and retry storms. |
| DLQ count | Messages that need a human. |
| Success and failure rate | The SLO signal. |

A correlation identifier must travel from the entry point through every queue and log line so one request can be followed end to end.
Each alarm names the action it triggers; an alarm nobody acts on is noise.
