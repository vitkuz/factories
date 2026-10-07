# Risk Severity

A shared scale for every reviewer, so findings from different reviewers can be compared and deduplicated.

## Severity = likelihood x impact, adjusted by blast radius and reversibility

Rate each factor, then pick the severity.

| Factor | Low | Medium | High |
|---|---|---|---|
| Likelihood | Needs rare or deliberate conditions | Plausible within a year at expected load | Expected in normal operation or at stated peak |
| Impact | Degraded experience, easy recovery | Visible outage or limited data issue | Data loss, breach, outage beyond driver, or spend beyond budget |
| Blast radius | One feature or one tenant | One service or several features | The whole system, all customers or all state |
| Reversibility | Quick rollback, no residue | Recovery takes hours or manual work | Permanent loss, leaked secret, one-way-door change |

## Definitions

| Severity | Meaning | Red-team bucket | Review bucket |
|---|---|---|---|
| Critical | High impact with at least medium likelihood, or any irreversible data loss, breach or unbounded cost. Violates a core driver. | `criticalFindings` | `highRisks` |
| Major | Material weakness likely to hurt in production; recoverable but expensive or visible. | `majorFindings` | `highRisks` or `mediumRisks` |
| Minor | Low impact or low likelihood; worth fixing but does not threaten a driver. | `minorFindings` | `mediumRisks` or `improvements` |

Rules of thumb:
- Irreversibility raises severity one level.
- A system-wide blast radius raises severity one level.
- Uncertainty about a high-impact driver is a risk by itself. Do not lower severity because evidence is missing; state the assumption.
- Do not inflate. If everything is critical, nothing is.

## Every high risk needs a disposition
Every critical or high-severity risk must end in exactly one of:

1. **Mitigation.** A concrete control that changes the design or operations, naming the component and the expected effect.
2. **Accepted risk.** A named owner accepts it with a rationale.

An accepted risk records:

```json
{
  "riskId": "R-007",
  "rationale": "Single-region deployment accepted; RTO of 24 hours is within the stated driver.",
  "owner": "Product owner",
  "acceptedOn": "2026-10-03",
  "revisitWhen": "Availability target tightens above 99.9%"
}
```

Constraints:
- A risk with neither mitigation nor accepted-risk record is unresolved.
- Critical risks that touch security, data loss or unbounded cost cannot be accepted by the reviewer who found them. They need a mitigation or a human decision.
- Acceptance needs an owner (a role or person) and a rationale tied to a driver. "Low priority" is not a rationale.
- Mitigated means the architecture now contains the control, not that someone plans to add it later.

## Mitigation vs accepted risk: when each fits
| Choose mitigation when | Choose accepted risk when |
|---|---|
| Fix is cheap relative to impact | Fix costs more than the loss it prevents |
| The risk threatens a core driver | The driver tolerates the outcome (for example RTO of a day) |
| Impact is irreversible | Impact is reversible and detectable |
| Likelihood is high | Likelihood is low and monitored |
