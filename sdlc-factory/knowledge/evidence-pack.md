# Evidence pack

After the line completes or stops, the run is judged on evidence, not on how polished the role
artefacts look. Build the pack from the role artefacts' handoff notes and the run state. These are
drafts for a human to confirm and sharpen — never invent clean handoffs.

## Result states

- `complete-pass` — all 10 role artefacts exist and evidence checks 1–12 pass.
- `documented-stall-pass` — at least 6 role artefacts exist, the line stopped at a documented hard
  stop (or at a role contract that proved too narrow to continue without fake context), and the run
  record explains why continuing would be unsafe or fake.
- `incomplete-fail` — fewer than 6 artefacts, missing run record, or an undocumented stop.

## seam-ledger.md — at least 3 findings

```
# Seam Ledger — <feature>

| # | Handoff (upstream → downstream) | Artefact | Mark | What happened | Gate status | Assumption used? | Owner to harden |
|---|---|---|---|---|---|---|---|
| 1 | | | under-supply / over-supply / missing / routing / clean | | | yes / no; if yes, name it | |

**First seam to harden:** <the one seam the team fixes first and why>
```

## human-gates.md — at least 2 observations

```
# Human Gates — <feature>

| # | Role or handoff | Gate status | Human decision | Owner |
|---|---|---|---|---|
| 1 | | training-open / hard-stop / missed / paused-approved / paused-blocked / recorded-open / n/a | | |

**Gate that matters most before pilot:** <name it>
```

`paused-approved` / `paused-blocked` apply only when a person actually decided during the run.

## eval-report.md — 13 checks

```
# Eval Report — <feature>

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | All 10 role specs present | pass / fail | |
| 2 | Role order 100,200,300,400,500,700,800,900,600,1000 followed | pass / fail | |
| 3 | Handoffs explicit (every role named what it read) | pass / fail | |
| 4 | Feature scoped (one feature, observable criteria) | pass / fail | |
| 5 | Role artefacts produced or documented stop | pass / fail | |
| 6 | At least 3 seam findings | pass / fail | |
| 7 | At least 2 human gates | pass / fail | |
| 8 | Eval report complete | pass / fail | |
| 9 | Cost log complete | pass / fail | |
| 10 | Risk note complete | pass / fail | |
| 11 | Final recommendation complete | pass / fail | |
| 12 | Improvement suggestions complete | pass / fail | |
| 13 | Factory-evaluation comparison | pass / fail / n/a | |

## Verdict
complete-pass / documented-stall-pass / incomplete-fail
**Reason:** one paragraph grounded in the 13 checks.
```

## cost-log.md

One row per role: `Status` (ran / skipped / stopped), `Model`, `Passes`, `Cost/token note`,
`Premium reason` (a premium model is allowed for at most one named, human-reviewed decision).

## risk-note.md

```
# Risk Note — <feature>

| # | Risk | Source role | Mitigation | Human owner |
|---|---|---|---|---|
| 1 | | | | |

## Residual risk
<What remains unresolved after the run?>
```

## final-recommendation.md

```
# Final Recommendation — <feature>

## Recommendation
adopt for team use / pilot with fixes / defer

## Rationale
<3–5 bullets grounded in role artefacts, seam findings, human gates and risk.>

## Next action
<Next concrete action and owner.>

## Pipeline improvement link
<The improvement-suggestions row to validate on the next run.>
```

## run-record.md

Header (date, feature, result state), then: evidence summary (the 13 checks with file per check),
the line (role, spec source — `own` / `own+overlay` / `fallback` — and artefact, in run order),
where the line stopped or stalled (or "did not stop"), seam findings, human gates, links to the
other pack files, and one paragraph "What I am handing the team": result state, the seam to harden
first, and the improvement to validate on the next run.
