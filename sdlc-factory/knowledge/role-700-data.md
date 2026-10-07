# Role 700 — Data

**Reads:** the architecture decision note.
**Produces:** the feature data design (data contract).
**Not for:** infrastructure, security, QA, implementation or delivery decisions.

## Instructions

Write the data contract for the feature: source data, fields, lineage, retention, quality checks,
audit events, privacy classification and unresolved owner decisions.

Whenever you define audit events, name their sink and a retention owner as an explicit gate. An event
that is emit-ready but has no destination or retention is an open hole that Infra/Ops and Security
will inherit — make it a named decision, not an implicit gap.

## Human gates

Pause if retention, classification or permitted use of customer data is unclear.

## Done when

Infra/Ops, Security and QA can verify data handling without inventing policy.
