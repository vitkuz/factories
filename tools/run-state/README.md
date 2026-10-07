# run-state

Records one factory run in `<runDir>/state.json`. The `any-factory` skill runs it after every step:
it **records, it never routes** — for a returned event it reads the edge from `pipeline.json`
(`condition`, `max`, `onMax`) and prints the targets the harness must follow.

It ships bundled as `<kit>/bin/state.mjs` (`factories/bin/state.mjs` in a project), so a consumer
needs node 20 and nothing else; these sources are for developing it.

```text
node factories/bin/state.mjs <command> <runDir> [<step> [<EVENT>]] [options]
        ↓  arguments   the command's argument guards         → refused: … (exit 2)
        ↓  loading     state.json (Zod), the run's graph     → refused: … (exit 2)
        ↓  guards      the command's guards, in order        → refused: … (exit 2)
        ↓  apply       one pure function: state → state + output
   state.json written atomically (temp file + rename), output printed as JSON (exit 0)
```

A refusal prints `refused: …` on stderr, **exits 2 and writes nothing**. Anything else that goes
wrong prints `error: …` and exits 1. Every command prints JSON on stdout; logs (`LOG_LEVEL=debug`) go
to stderr.

## Use

```sh
S=factories/bin/state.mjs
node $S open <id | pipeline.json> "$RUN" --param topic="…"   # then:
node $S start "$RUN"
node $S start-step "$RUN" <step>
node $S step-done "$RUN" <step> <EVENT> --output <file> [--report name=value] [--note "…"]
node $S human "$RUN" <step> <EVENT> --note "…"
node $S --list-guards        # every command and everything that can make it refuse, in order
```

Run it from the project root: `{{rootPath}}` is the nearest folder at or above the working
directory holding a `.claude/` directory (never found from this file, which sits inside the kit
submodule where `factories/.git` is a file). `<id>` means `factories.local/<id>/pipeline.json`, else
`factories/<id>/pipeline.json`, and paths in state.json are relative to the root.

## Commands

| Command | What it records | Prints |
|---|---|---|
| `open <id\|pipeline.json> <runDir> [--param n=v …]` | A new run, `IDLE`. Params come from `pipeline.json`; `--param` overrides them and keeps the default's type (`count=5` is a number when the default is one). Every step `PENDING`, its `order` its breadth-first layer from `START`. (`open <runDir> --pipeline <file>` works too.) | `{runId, pipeline, pipelineFile, stateFile, params, start}` |
| `start <runDir>` | `RUNNING`; the `START` steps are routed to (the frontier). | `{status, ready}` |
| `start-step <runDir> <step>` | A new pass of the step: `RUNNING`, `passes` + 1, last pass's `event`/`outputs`/`note`… cleared. | `{step, pass}` |
| `step-done <runDir> <step> <EVENT> [--output f …] [--report n=v …] [--note t]` | The event a subagent returned: the step `COMPLETED`, the edge resolved (see Routing), its targets routed to, stranded steps `SKIPPED`. | `{step, event, targets, capped, ready, waiting, running, skipped, finished}` |
| `human <runDir> <step> <EVENT> [--note t] [--output f …]` | The same for a human step (`agent: "human"`); `--output` defaults to the step's declared `output`. History says `HUMAN_ANSWER`. | as `step-done` |
| `fail <runDir> <step> --error <text>` | A running step that could not be done: the step **and the run** `FAILED`. | `{step, status}` |
| `skip <runDir> <step> --reason <text>` | A step that will not run: `SKIPPED`, off the frontier, and every step only it led to `SKIPPED` too. | `{step, ready, running, waiting}` |
| `ready <runDir>` | Nothing. | `{status, ready, running, waiting, done}` |
| `show <runDir>` | Nothing; needs no pipeline. | state.json in its written form |
| `finish <runDir>` | `COMPLETED`; every step never reached `SKIPPED`. | `{status, pipeline}` |

The event may also be given as `--event <EVENT>` or `--answer <EVENT>`. `--output` paths are kept
relative to the run folder (an absolute one is made relative to it). `--report` values are typed:
`true`/`false` → boolean, a plain number → number, anything else text.

## What each command refuses, and why

`--list-guards` prints the live list. Every check is a named guard; the first that fails is the
refusal.

**Loading** (between the argument guards and the command's own guards):

| Check | Commands | Refuses when |
|---|---|---|
| `run-not-open` | open | the run folder already holds a state.json (a run is opened once) |
| `pipeline-found` | open | the pipeline is neither an id under `factories.local/` or `factories/` nor a path to a pipeline.json |
| `state-file-exists` | all but open | there is no state.json (open the run first) |
| `state-file-valid` | all but open | state.json is not JSON, or not the shape of `factories/state.schema.json` (an unknown key too) |
| `pipeline-file-exists` | all but open, show | the graph file is gone: the run's own `pipeline.json` snapshot, else `state.pipelineFile` |
| `pipeline-file-valid` | open and all but show | the graph is not JSON or fails the pipeline Zod shape (run the validator) |

**Guards** (in the order each command checks them):

Every command first checks `run-dir-given` (it names the run folder). Then:

| Command | Arguments | Guards (after loading) |
|---|---|---|
| open | — | `params-are-pairs`, `param-known`, `param-fits-type`, `param-has-value` |
| start | — | `run-is-idle` |
| start-step | — | `run-is-running`, `step-is-named`, `step-is-known`, `step-not-running`, `step-is-routed`, `fan-in-ready` |
| step-done | `event-given` | `run-is-running`, `step-is-named`, `step-is-known`, `step-is-running`, `step-is-agent`, `reports-are-pairs`, `event-is-known`, `condition-is-valid`, `fallback-exists`, `cap-not-spent` |
| human | `event-given` | as step-done, with `step-is-human` in place of `step-is-agent` |
| fail | `error-given` | `run-is-running`, `step-is-named`, `step-is-known`, `step-is-running` |
| skip | `reason-given` | `run-is-running`, `step-is-named`, `step-is-known`, `step-is-pending` |
| ready, show | — | — |
| finish | — | `run-is-running`, `nothing-running-on-finish`, `nothing-routed-on-finish` |

Why the less obvious ones exist:

- `step-is-routed` — a step runs only when the graph sent the run there (START or a target). The
  harness never picks steps itself.
- `fan-in-ready` — a step that other live branches can still reach waits for them: a join runs
  once, with every branch's output.
- `step-is-agent` / `step-is-human` — a person's answer and a subagent's event are recorded
  differently (`HUMAN_ANSWER`, default outputs), so the wrong command is refused rather than guessed.
- `param-has-value` — an empty default in `pipeline.json` means "ask the user"; the run does not
  start on a blank.
- `event-is-known`, `condition-is-valid`, `fallback-exists`, `cap-not-spent` — the four ways an
  event cannot be routed (see below). The run stops there; the harness reports it and never routes
  around it.

## Routing: how an event becomes targets

`src/features/routing/resolve-edge.utils.ts`, pure:

1. The event must be a key of the step's `transitions` → else `event-is-known` refuses.
2. Its edge has a `condition`? Evaluate it (below). True → take the edge. False → take the step's
   **first edge without a condition** (none → `fallback-exists` refuses). The step still records the
   event it returned; the edge counted is the one taken.
3. The edge taken has a `max` and `state.edges["step:EVENT"]` already reached it → take its
   `onMax` (`capped: true`, an `EDGE_CAPPED` history entry, the count stays). No `onMax` →
   `cap-not-spent` refuses. Otherwise take its `target` and count the edge.

Then the step is `COMPLETED`, every target but `END` is added to the frontier (a target that was
`SKIPPED` goes back to `PENDING`), and every never-started step that nothing live (running or routed)
can reach any more is `SKIPPED` with the reason. `finished` is true when nothing is running or
routed: call `finish`.

**Ready or waiting** (`readiness.utils.ts`): a routed step is ready when no other live step can
still reach it along forward edges. Edges with a `max` are loop-backs and do not count, so a retry
loop never blocks; `onMax` exits do count.

**Conditions** (`condition/`): `> >= < <= == !=`, `and`, `or`, `not`, parentheses, numbers
(`-1.5`), quoted text (`'en'` or `"en"`), `true`, `false`, and names. A name resolves from the
first scope that has it: **reported values** (`--report`, merged over the run) → **params** →
**constants** → **built-ins** (`id`, `date` = the run's creation day, `slug` = the run folder's
name without its date). An unknown name refuses. As in the original recorder: both sides of
`and`/`or` are evaluated, `==` compares loosely (`3 == '3'`), and `not` binds to the value next to it
(`not a > 1` is `(not a) > 1`).

## state.json

The shape is frozen: the kit's `state.schema.json` (beside `pipeline.schema.json`), and its Zod twin
`src/features/state/state.schema.ts` (`tests/state-schema-sync.test.ts` fails when they drift). The
recorder writes keys in a fixed order, sorts `steps`, `edges`, `vars` and each history entry's
`details`, drops an empty `frontier` and `vars`, and stamps RFC 3339 timestamps with nanoseconds that
strictly increase — also across processes: the clock starts after the file's `updatedAt`. A new
state.json's `$schema` is `factories/state.schema.json` (relative to the project root).

## Add, change or remove a guard

A guard is one file and one place in a command's list.

1. Write `src/features/guards/<guard-id>.guard.ts`:

   ```ts
   import type { RunContext } from '../commands/commands.types.js';
   import type { Guard } from './guards.types.js';
   import { defineGuard } from './guards.utils.js';

   export const noteGiven: Guard<RunContext> = defineGuard<RunContext>({
     id: 'note-given',
     description: 'A human answer carries a note.',
   })(({ input }) => (input.note ? undefined : 'human needs --note "<what they added>"'));
   ```

   The check gets the context — `RunContext` (`state`, `pipeline`, `input`, `clock`) for a run
   command, `OpenContext` for open, `CommandInput` for an argument guard — and returns `undefined`
   to let the command go, or the refusal message. It must not change anything.
2. Export it from `src/features/guards/index.ts` and put it in the command's `guards` (or
   `inputGuards`, checked before any file is read). **Its position is its order.**
3. Add a case to `tests/guards.test.ts`, then `npm run check && npm run bundle` and commit
   `bin/state.mjs` with the sources (`tests/bundle.test.ts` fails while it is stale).

To **drop** a guard, delete it from the command's list (then its file and test if no command uses
it). To **change** one, edit its file. The four routing guards share one implementation
(`route-failure.utils.ts` asks `resolveEdge` and refuses for its own reason), so routing rules live
in one place.

## Add or remove a command

1. Write `src/features/commands/<name>.command.ts`: `kind` (`run` for a command on an open run),
   `name`, `arguments` (positional, in order, from `runDir`, `step`, `event`, `pipeline`),
   `options` (from `src/cli/program.ts`), `usage`, `summary`, `inputGuards`, `guards`, and a pure
   `apply(context) → applied(output, newState?)`. Return no state to write nothing. Build the new
   state with the transitions in `src/features/state/state.utils.ts` (`record`, `updateStep`,
   `setStatus`, …) composed with `flow`; take timestamps only from `context.clock`.
2. Add it to `COMMANDS` in `src/features/commands/index.ts`. The CLI, `--help` and `--list-guards`
   pick it up from there. A new option needs one line in `OPTIONS` in `src/cli/program.ts`.
3. Test it in `tests/commands.test.ts` with `execute(command)(runContext(…))` and the fixed clock.

To remove a command, delete it from `COMMANDS`, then its file and tests.

## Code layout

```text
../../bin/state.mjs               the committed esbuild bundle of src/cli/index.ts (npm run bundle)
esbuild.config.mjs                the bundle options, shared by the bundle script and tests/bundle.test.ts
src/
├─ cli/                           commander (built from the registry), args → CommandInput, composition root
├─ clients/
│  ├─ file-system/                readText, exists, makeDirectory, writeTextAtomic (temp + rename)
│  └─ clock/                      the wall clock (ns, strictly increasing), run ids
├─ features/
│  ├─ commands/                   index.ts (THE REGISTRY), one <name>.command.ts per command, types, utils
│  ├─ guards/                     one <guard-id>.guard.ts per refusal, defineGuard, firstRefusal
│  ├─ routing/                    resolve-edge, readiness, skip-stranded, lookup, condition/ (tokenize, evaluate)
│  ├─ state/                      state.schema.ts (Zod), types, utils (written form, transitions), read/write services
│  ├─ pipeline/                   pipeline.schema/types/utils (copied from tools/validation), graph.utils, load/locate (factories.local/ first)
│  ├─ record/usecases/            open-run, run-command: read → pure command → atomic write
│  └─ report/                     --list-guards, JSON output
└─ shared/                        config (env, project root from cwd), utils (logger, fp, result, paths)
tests/                            guards, commands (pure, fixed clock), routing, conditions, use cases,
                                  schema sync, project root, bundle, every real factory open → finish
                                  (from a throwaway project, tests/kit.ts)
```

The clock and the run-id generator are injected (`RecordDeps`), so every test is deterministic.
