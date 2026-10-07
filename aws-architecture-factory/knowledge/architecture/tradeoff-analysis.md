# Trade-off Analysis

Compare candidates against explicit drivers. Not every criterion matters equally, so never use equal weights by default.

## Step 1: criteria and weights from drivers

1. Choose 5 to 9 criteria that reflect the drivers (for example burst scaling, ops overhead, runtime flexibility, latency risk, cost at low load, cost at sustained load, security fit).
2. Give each criterion a weight. Weights sum to 1.0.
3. Show how each weight was derived: name the driver and the reasoning. A weight without a derivation is invalid.

| Criterion | Weight | Derived from |
|---|---|---|
| Ops overhead | 0.25 | `team.size` = 2, `operationalConstraints` says no on-call team |
| Burst scaling | 0.20 | `traffic.peak` is 20x `traffic.average` |
| Cost at low utilization | 0.20 | `budget` is tight, traffic is mostly idle |
| Runtime flexibility | 0.15 | native image libraries in `functionalRequirements` |
| Latency risk | 0.10 | `latency.target` is relaxed (async result) |
| Security fit | 0.10 | `security.sensitivity` is moderate |

Rules: a hard constraint (mandated region, required compliance) is a pass/fail gate, not a weighted criterion. A candidate that fails a gate is out, whatever its score.

## Step 2: score scale

Score each candidate on each criterion from 1 to 5.

| Score | Meaning |
|---|---|
| 5 | Strong fit, evidence supports it. |
| 4 | Good fit. |
| 3 | Adequate, or depends on conditions. |
| 2 | Weak, a notable risk. |
| 1 | Poor fit or likely violates the driver. |

- Each score has a short justification citing evidence or an implication from research. "Often stronger" needs a condition.
- Mark a score as uncertain when it rests on an unresearched hypothesis or an open assumption.
- Weighted total = sum of weight x score. Show the arithmetic.

```text
| Criterion        | W    | Serverless | Containers | Hybrid |
| Ops overhead     | 0.25 | 5          | 3          | 3      |
| Burst scaling    | 0.20 | 5          | 4          | 5      |
| ...              |      |            |            |        |
| Weighted total   | 1.00 | 4.35       | 3.50       | 3.90   |
```

## Step 3: sensitivity analysis

For each assumption with HIGH impact and LOW confidence:
1. State the assumption and the plausible range.
2. Change the affected weights or scores (for example, sustained load instead of bursty; 10x traffic).
3. Recompute totals.
4. Report whether the ranking changes and at what value it flips.

If the ranking flips inside the plausible range, the decision is sensitive: say so, lower the confidence of the selection, and consider a reversible first step.

## Step 4: wins under which conditions

For each candidate, write the conditions under which it wins, as testable statements:

| Candidate | Wins when | Loses when |
|---|---|---|
| Serverless | utilization stays low; jobs are short; team is small | sustained high load; long jobs; special runtimes |
| Containers | steady load; custom runtime; long jobs | idle most of the time; no one to operate clusters |

These conditions feed the selection record and the "revisit when" part of the decision record.

## Quality checks

- Weights sum to 1.0 and each has a driver.
- No candidate wins only because the criteria favor it by construction.
- The summary names the winner, the margin, and whether the ranking survives sensitivity.
