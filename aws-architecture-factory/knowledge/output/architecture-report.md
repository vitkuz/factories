# Architecture Report

The final report is the readable entry point for the whole architecture. It synthesizes the other artifacts; it must not contradict them. Its central job is to explain why every major AWS service exists.

## Structure
Use these sections in this order.

| # | Section | Content |
|---|---|---|
| 1 | Summary | The problem, the recommended architecture and the main reason, in under 10 lines. State confidence and the biggest open risk. |
| 2 | Drivers | The architecture drivers that shaped the design (traffic, latency, availability, RTO/RPO, data, security, compliance, budget, team). |
| 3 | Assumptions | Every important inferred value with reason, confidence and decision impact. Flag high-impact low-confidence ones. |
| 4 | Selected architecture and why every service exists | Table: service, role, driver served, why chosen over the alternative. No service without a role. |
| 5 | Rejected alternatives | Each rejected candidate with the reason tied to drivers. |
| 6 | Trade-offs | What the selected design gives up and what it gains. Weighted by drivers. |
| 7 | Failure model | What can fail, detection, retries, state location, duplication and loss, quarantine, recovery, what the user sees. |
| 8 | Security | Trust boundaries, authN/authZ, IAM, secrets, encryption, network exposure, audit, abuse cases. |
| 9 | Observability | Metrics, logs, traces, alarms, dashboards, SLO signals, correlation ids; for async flows queue depth, message age, retries, DLQ. |
| 10 | Review and red-team outcome | Pillar findings, lens findings, red-team findings, and what changed because of them. |
| 11 | Risks | The risk register summary: open, mitigated, accepted, with owners. |
| 12 | Cost | Cost shape, scenario ranges, unbounded-cost controls, with pricing sources and caveats. |
| 13 | Diagrams | Embedded or linked diagrams, each with a caption. |
| 14 | ADR links | List of ADRs with one-line decisions. |
| 15 | Open questions | Unknowns, human decisions pending, assumptions to confirm. |

## Writing rules
- Plain language; tables for services, risks and trade-offs.
- Every claim about AWS behavior carries a source reference or is labeled an assumption.
- Same names everywhere: services, components and ids match the architecture, ADRs, risks and diagrams.
- Include accepted risks verbatim with owner and rationale.
- State the gate verdict and the date of the information used.
- Do not hide weaknesses. A report with no risks is a defect.

## Definition of Done
The report is complete only when all of these hold:

- Architecture drivers are explicit.
- Major assumptions are visible.
- Key architecture uncertainties were evaluated.
- Competing designs were considered where appropriate.
- The selected design has documented trade-offs.
- The design passed the six-pillar review.
- No unresolved critical red-team finding remains.
- Major decisions have ADRs.
- Risks are recorded.
- Diagrams match the selected architecture.
- The report can explain why every major AWS service exists.

Before returning, check each item against the artifacts. If one fails, say which and why rather than claiming completion.
