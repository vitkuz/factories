# Feature and run brief

## Feature file

```
# <Feature name>

<Two or three sentences: what it is and who it is for.>

## Acceptance criteria

- [ ] <criterion>
- [ ] <criterion>
- [ ] <criterion>
```

Pick one small-to-medium feature — the one that touches the most roles. Three to six acceptance
criteria, each observable.

## Factory run brief (the Delivery frame)

```
# Factory Run Brief

## Feature
<Name the feature and the user/business moment.>

## Decision this run should support
<What should a human be able to decide after reading the run pack?>

## Review owner
<Who reviews the evidence and owns the final decision?>

## Useful evidence
- <What evidence would make this run useful even if it stalls?>
- <Which seam or gate is especially watched?>

## Constraints
- <Data, tool, budget, policy or time constraints.>

## Human-owned decisions
- <Decisions the line must surface, not make.>

## Line-level HITL handoffs
| Trigger | Human owner | Evidence packet | Decision options | Return path |
|---|---|---|---|---|
| <What should pause the line?> | <Who decides?> | <Which artefacts to read?> | approve / block / narrow scope / request clarification / defer | <Where the decision is recorded, which role reads it next> |
```

The brief frames the decision without changing the role order. Line-level pause triggers always
include: a role tries to accept risk without a named human; a role chooses scope beyond the feature;
a role asks for secrets, credentials, client-confidential or production data; a role needs a policy,
compliance, budget or release decision.
