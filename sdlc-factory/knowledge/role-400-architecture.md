# Role 400 — Architecture

**Reads:** the design note.
**Produces:** a thin architecture decision note.
**Not for:** implementation, QA, security, data ownership or delivery approval decisions.

## Instructions

Write a thin architecture decision note: components touched, integration points, data flow, key
non-functional requirements, risks, and the decisions delegated to Engineering, Data, Infra/Ops,
Security and QA.

Name the owner and data classification of each source system the feature reads or writes. Where the
upstream did not carry these, record them as one explicit gate that Data, Infra/Ops and Security
inherit by reference — do not leave each downstream role to re-derive the same missing fact.

## Human gates

Pause if the feature changes system boundaries, requires a new platform dependency, or accepts a
non-functional risk.

## Done when

Engineering, Data, Infra/Ops, Security and QA can each produce their output without guessing the
structure.
