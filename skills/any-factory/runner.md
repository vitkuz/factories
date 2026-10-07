# Runner

Walks the pipeline — `factories.local/<id>/pipeline.json` (the project's own
factory) or `factories/<id>/pipeline.json` (the shared kit) — the single source
of truth. Run each step as a subagent, follow its edges until `END`.

## Fields

### Top level

| Field         | Meaning |
|---------------|---------|
| `id`          | Pipeline id; matches the folder `factories/<id>/` or `factories.local/<id>/`. |
| `name`, `author`, `description` | Optional, for people. |
| `constants`   | Fixed values. Always starts with `rootPath: "cwd"`, `skillPath: "."`, `homePath: "~"`. |
| `params`      | Runtime inputs with defaults; `name=value` arguments override them (a name given twice: the last value wins). Empty default = ask the user. |
| `hooks`       | `before` / `after` shell commands. You run them from `rootPath`. |
| `outputDir`   | Run folder, e.g. `{{rootPath}}/run/{{id}}/{{slug}}-{{date}}`. |
| `START`       | Entry step(s), an array. |
| `steps`       | The graph nodes, one subagent each. |

### Step

| Field         | Meaning |
|---------------|---------|
| `agent`       | Agent type to spawn (`general-purpose`, a custom agent, or `human`). Custom agent not found → use `general-purpose`, say so in the report. |
| `model`       | Optional: `fable`, `opus`, `sonnet`, `haiku`. Pass exactly as the Agent tool's `model`; omitted → leave unset. |
| `prompt`      | Task message, array of lines joined with `\n`. |
| `system`      | Optional lines appended to the subagent's system prompt. |
| `knowledge`   | Files whose full text you paste into the task message. A file under `{{rootPath}}/factory-data/` is the project's own run data: missing → paste nothing and say so in the task message. |
| `input`       | Files the step reads; you pass absolute paths. Globs allowed. |
| `output`      | Files the subagent writes itself. Globs allowed; record the files actually produced. |
| `workDir`     | Optional scratch folder for the step; default `outputDir`. |
| `transitions` | `EVENT → edge`. The subagent returns exactly one event name. |

### Edge

| Field       | Meaning |
|-------------|---------|
| `target`    | Next step(s), or `END`. Several = fan-out: spawn them in one message. Several steps pointing at one = fan-in: run it once, when `ready` lists it. |
| `max`       | How many times this edge may be taken per run. Every loop needs one. |
| `onMax`     | Where to go once `max` is spent. Missing → stop and report. |
| `condition` | Edge taken only if true, e.g. `findings > 1`. Names come from values the step reported, then params, constants. |

### Substitution

`{{name}}` resolves from params, then constants, then built-ins: `id`, `slug`
(kebab-case of the main param), `date` (`YYYY-MM-DD`), `outputDir` (once resolved).
Resolve the anchors to absolute paths first; `cwd`, `.`, `~` never reach a prompt or a path.

| Anchor      | Resolves to |
|-------------|-------------|
| `rootPath`  | `pwd` — the repository root. No `.claude/` there → stop. |
| `skillPath` | `{{rootPath}}/.claude/skills/<id>` |
| `homePath`  | `$HOME` |

## Tools

Two CLIs, shipped in the kit as single-file bundles: nothing to install, nothing
to build. Run them **from the project root** (the folder holding `.claude/`);
only you run them, never a subagent. Both take the id (looked up under
`factories.local/`, then `factories/`) or a path to a `pipeline.json`.

    V=factories/bin/validate.mjs    # the gate
    S=factories/bin/state.mjs       # the recorder
    RUN=<resolved outputDir>        # absolute

## Validate

Before anything runs:

    node $V <id>                 # or a path to a pipeline.json
    node $V <id> --json          # {"ok", "pipeline", "errors", "warnings", "rulesRan", "findings"}
    node $V --list-rules         # every rule, in order

Exit 0 → run. Errors → show them, stop, spawn nothing. Warnings → mention, run.
First the Zod shape (twin of `factories/pipeline.schema.json`), then the graph rules:
targets exist, every step and `END` reachable, every `{{name}}` declared, every
`knowledge` file exists, every human step has an output, loops have a `max`
(warning). Each finding ends with its rule id, e.g. `[targets-exist]`. Rules and
how to change them: `factories/tools/validation/README.md`.

## State

Only you record, never a subagent, never by hand. Each command prints JSON;
follow the `targets` it returns. `refused: …` (exit 2) → nothing recorded, stop
and report; never route around it.

| When | Command |
|------|---------|
| Run folder created | `node $S open <id> "$RUN" --param name="value" ...` then `node $S start "$RUN"` |
| Before spawning a step (human too) | `node $S start-step "$RUN" <step>` |
| The moment a subagent returns | `node $S step-done "$RUN" <step> <EVENT> --output <file> ... [--report name=value] [--note "..."]` |
| User answers a human step | `node $S human "$RUN" <step> <EVENT> --note "..." [--output <decision file>]` |
| Step could not be completed | `node $S fail "$RUN" <step> --error "..."` |
| Step will not run | `node $S skip "$RUN" <step> --reason "..."` |
| Deciding what may start (fan-in) | `node $S ready "$RUN"` |
| Reading the state back | `node $S show "$RUN"` |
| A branch reached `END`, nothing running | `node $S finish "$RUN"` |

- `open` takes params from `pipeline.json`, overridden by `--param`; it refuses an
  unknown param and a param with no default and no value. A value keeps its
  default's type (`sub_questions=3` is a number when the default is one).
- `<EVENT>` may also be given as `--event` or `--answer`.
- `--output` paths are relative to the run folder; on `human` they default to the step's `output`.
- `--report name=value` stores what the step reported; edge conditions read it first.
- The recorder reads the run's own `pipeline.json` snapshot (`hooks.before` copies it), else the factory's `pipeline.json`.

`step-done` and `human` print:

```json
{ "step": "review", "event": "REVISE", "targets": ["write-report"], "capped": false,
  "ready": ["write-report"], "waiting": {}, "running": [], "skipped": [], "finished": false }
```

- **`targets`** — where the event goes, after the edge's `condition`, `max` and `onMax` (`capped: true` once the max is spent). Follow it.
- **`ready`** — routed steps you may start now. **`waiting`** — fan-in steps and the live steps they wait for.
- **`skipped`** — steps the route closed for good. Do not spawn them.
- **`finished`** — nothing running or routed: call `finish`.

`node $S --list-guards` prints every command and each check that can refuse it,
in order. What they mean and how routing decides targets: `factories/tools/run-state/README.md`.
The shape of `state.json`: `factories/state.schema.json`.

## Run

Validate → resolve params → `mkdir -p` outputDir → `open` + `start` →
`hooks.before` → steps from `START` → `hooks.after` → `finish` → report.

- **`hooks.before`** — you run them from `rootPath`, in order; a failure stops the run before any subagent.
- **`hooks.after`** — at `END`, succeeded or failed; a failure is reported, not fatal.

### Subagent task message

In this order:

1. The resolved `prompt`.
2. The full text of every `knowledge` file.
3. Absolute `input` paths, with "read them".
4. Absolute `output` paths, with "write them yourself".
5. The allowed events (keys of `transitions`) and what each means, with "return exactly one as the last line".

`system` goes into the subagent's system prompt; if that is not possible, put it
at the top under `## Role`.

**Revision pass** — when an edge re-enters a step that already ran, also give
the path of the feedback file: fix exactly what it lists, leave the rest.

### Human step

No subagent. Ask the `prompt` with AskUserQuestion, options = exactly the
`transitions` events. You write the answer and the user's note into the step's
`output`, then record with `human`. Sent back without saying what to change →
ask what to change first.

### Report

- The run folder and the deliverable files.
- The event that ended the run; if it is not a success, say so plainly.
- Any cap that changed the route, any step that failed.
- Every skipped step and why.

## Rules

- **`pipeline.json` is the source of truth.** Read it in full every run; it wins over anything else.
- **The main harness owns the state.** Only you run the recorder (`$S`), once per subagent, the moment it returns — never in a batch, never by hand.
- **A subagent only reads and produces artifacts.** It reads its `input`, writes its own `output` files and returns one event name. It is never told about the state or the recorder.
- **One subagent per step, per pass.** Never merge steps.
- **Follow the route the recorder returns.** A refusal (spent cap without `onMax`, false condition) stops the run; never route around it.
- **Unknown event** → re-prompt once with the allowed list; wrong again → stop.
- **Never skip silently.** A step that will not run is skipped with a reason.
- **Never edit** `runner.md`, `factories/pipeline.schema.json`, `factories/state.schema.json` or any `pipeline.json` during a run. A run never writes inside `factories/` (the kit): what it keeps across runs goes to `{{rootPath}}/factory-data/<id>/`.
