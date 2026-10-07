# validation

Validates a factory `pipeline.json` before a run. The `any-factory` skill (and `/create-any-factory`)
run it as the gate: **exit 0 → run**. It ships bundled as `<kit>/bin/validate.mjs` (`factories/bin/validate.mjs`
in a project), so a consumer needs node 20 and nothing else; these sources are for developing it.

```text
factories.local/<id>/pipeline.json, else factories/<id>/pipeline.json
        ↓  read          not JSON → error "cannot read …"
        ↓  shape (Zod)   src/features/pipeline/pipeline.schema.ts   → errors "schema: pipeline.<path>: …"
        ↓  rules         src/features/rules/index.ts (the registry) → errors / warnings, each tagged [rule-id]
   report  (text, or --json)
```

The rules run only once the shape passes, so they get a typed `Pipeline`. The setup rules (where the
tool runs from) always run.

## Use

```sh
node factories/bin/validate.mjs <id>                 # factories.local/<id>/pipeline.json, else factories/<id>/pipeline.json
node factories/bin/validate.mjs path/to/pipeline.json
node factories/bin/validate.mjs <id> --json          # {"ok","pipeline","errors","warnings","rulesRan","findings"}
node factories/bin/validate.mjs --list-rules         # what is checked, in order
node factories/bin/validate.mjs                      # no id: lists the ids, exit 2
```

Run it from the project root. `{{rootPath}}` is the nearest folder at or above the working
directory that holds a `.claude/` directory (else the working directory itself) — never found from
this file, which sits inside the kit submodule where `factories/.git` is a file; `--root <dir>`
overrides it. Exit `0` means no errors (warnings never fail the gate), `1` means the pipeline has
errors, `2` means the call itself was wrong.

`errors` and `warnings` in `--json` are plain strings with the same text the old `validate.mjs`
(now removed) printed (factory-diagram matches on them). `findings` carries the same findings with their rule id
and severity.

## What is checked

`--list-rules` prints the live list. A short version:

| Stage | Rule | Severity |
|---|---|---|
| shape | `schema`: keys, types, kebab-case names, UPPER_SNAKE events, anchors `cwd`/`.`/`~`, `onMax` needs `max` | error |
| graph | `start-exists`, `targets-exist`, `steps-reachable`, `end-reachable` | error |
| graph | `loops-capped`: every loop passes an edge with `max` | warning |
| graph | `human-step`: needs an `output` (error), a `model` is ignored (warning) | both |
| names | `placeholders-declared`, `output-dir-not-recursive` | error |
| paths | `knowledge-exists`: missing → error (under `factory-data/`: warning, it is project data), run-time variable or glob Node can't expand → warning | both |
| conventions | `anchors-first`, `schema-ref`, `id-matches-folder`, `wrapper-skill-exists` | warning |
| setup | `root-has-claude`, `cwd-is-root` | warning |

## Add, change or remove a rule

A rule is one file and one line in the registry.

1. Write `src/features/rules/pipeline/<rule-id>.rule.ts` (or `setup/` for a rule that doesn't need
   the pipeline):

   ```ts
   import type { Finding, PipelineContext, PipelineRule } from '../rules.types.js';
   import { defineRule } from '../rules.utils.js';
   import { stepEntries } from '../../pipeline/pipeline.utils.js';

   export const stepHasModel: PipelineRule = defineRule<PipelineContext>({
     id: 'step-has-model',
     description: 'Every agent step names a model.',
   })(({ pipeline }, report) =>
     stepEntries(pipeline)
       .filter(([, step]) => step.agent !== 'human' && step.model === undefined)
       .map(([name]): Finding => report.warning(`steps.${name}: no "model", it inherits the harness model`)),
   );
   ```

   The check gets the context (`pipeline`, `document` as written, `file`, `rootPath`, `cwd`,
   `homePath`, `fileSystem`) and a `report` with `error(message)` and `warning(message)`, which
   stamp the rule id on each finding. Return `[]` when everything is fine. Start the message with
   the path at fault (`steps.<name>…`) so it can be found.
2. Import it in `src/features/rules/index.ts` and add it to `PIPELINE_RULES` (or `SETUP_RULES`).
   Its position in the list is its position in the output.
3. Add a case to `tests/rules.test.ts`, then `npm test && npm run build`.

To **remove** a rule, delete its line in the registry, then its file and its test. To **change** a
rule, edit its file: each rule is a single pure function.

To change the **shape** (a new key, a new model), edit `src/features/pipeline/pipeline.schema.ts`
*and* the kit's `pipeline.schema.json`. `tests/schema-sync.test.ts` fails until the
two agree. `tests/factories.test.ts` checks every factory of the kit from a throwaway project
(`tests/kit.ts`): `.claude/skills/` linked, `factories` → the kit, plus a local one.

## Code layout

```text
../../bin/validate.mjs          the committed esbuild bundle of src/cli/index.ts (npm run bundle)
esbuild.config.mjs              the bundle options, shared by the bundle script and tests/bundle.test.ts
src/
├─ cli/                         commander args, composition root (real disk, stdout, exit code)
├─ clients/file-system/         the disk: readText, exists, listDirectories, glob
├─ features/
│  ├─ pipeline/                 pipeline.schema.ts (Zod), pipeline.types.ts, pipeline.utils.ts (pure graph helpers)
│  │  └─ services/              locate (id → factories.local/ then factories/), read (JSON), parse (Zod issues → messages)
│  ├─ rules/                    index.ts (THE REGISTRY), rules.types.ts, rules.utils.ts (defineRule)
│  │  ├─ pipeline/*.rule.ts     one rule per file
│  │  └─ setup/*.rule.ts
│  ├─ validate/usecases/        read → shape → rules → report
│  └─ report/                   text, --json, --list-rules
└─ shared/                      config (env, project root from cwd), utils (logger, fp, errors)
tests/                          rules, shape messages, locate, project root, every real factory, schema sync, bundle
```
