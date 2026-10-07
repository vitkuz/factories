# factories

A kit of Claude Code **factories**: multi-step subagent pipelines, each a graph in
`<id>/pipeline.json`, run by one universal skill (`any-factory`) with a validator (the
gate) and a run recorder (the state). The kit is mounted as a git submodule at
`factories/` in every project that uses it; nothing in it needs `npm install`.

```
factories/                       the kit (this repository) as a project sees it
├── <id>/pipeline.json           one factory: params, constants, hooks, steps, edges
│   └── knowledge/               what its steps read (methods, templates, checklists)
├── pipeline.schema.json         the shape of a pipeline.json (editor autocomplete, the Zod twin in tools/)
├── state.schema.json            the shape of a run's state.json
├── skills/                      any-factory (the runner), create-any-factory, one wrapper skill per factory
├── bin/validate.mjs             the gate:     node factories/bin/validate.mjs <id>
├── bin/state.mjs                the recorder: node factories/bin/state.mjs <command> <runDir> …
├── tools/validation/            the validator's TypeScript sources and tests (bundled into bin/)
├── tools/run-state/             the recorder's TypeScript sources and tests (bundled into bin/)
├── scripts/                     hook scripts every pipeline may call, the secret and bundle checks
└── install.sh                   links skills/* into the project's .claude/skills/
```

The factories: `adaptive-research-factory`, `aws-architecture-factory`,
`consulting-research-factory`, `feature-factory`, `mckinsey-research-factory`,
`quick-research-factory`, `repurpose-factory`, `sdlc-factory`,
`strategy-research-factory`, `write-articles-factory`. Each wrapper skill's
description says what it does; `/<id> name=value …` runs it.

## Add the kit to a project

From the project root (the folder holding `.claude/`):

```sh
git submodule add -b main https://github.com/vitkuz/factories.git factories
bash factories/install.sh            # .claude/skills/<name> -> ../../factories/skills/<name>
node factories/bin/validate.mjs      # lists the ids; node 20+, nothing to install
git add .gitmodules factories .claude/skills
git commit -m "Add the factories kit"
```

A fresh clone of the project needs `git submodule update --init factories` and
`bash factories/install.sh` once. `install.sh` is idempotent: it never overwrites a
`.claude/skills/<name>` that is not already its own symlink (it lists those and goes on);
`--dry-run` shows what it would do.

Where things land in the project:

| Path | What |
|---|---|
| `run/<id>/<slug>-<date>/` | one run: the steps' outputs, `state.json`, `pipeline.json` snapshot |
| `factory-data/<id>/` | what a factory keeps across runs (insight stores, lessons, a project map); runs never write inside `factories/` |
| `improvements/<id>/` | improvement memos some factories collect |
| `factories.local/<id>/` | the project's own factories (below) |

`feature-factory` needs a project map at `factory-data/feature-factory/project-map.md`
(start from `factories/feature-factory/knowledge/project/project-map.template.md`) and takes
the project's `tenant`, `project`, `awsAccount`, `awsProfile` as params; a project keeps a
real `.claude/skills/feature-factory/SKILL.md` of its own to pass them (install.sh leaves it
alone). The `hooks.after` cost attribution needs the `ai-usage` tool; without it the hook prints
one line and exits 0.

## Update the kit in a project

```sh
git submodule update --remote factories    # or: cd factories && git pull
bash factories/install.sh                  # new wrapper skills, if any
git add factories && git commit -m "Bump factories"
```

## Add a factory

`/create-any-factory <description of the steps>` drafts, writes and validates it. Two kinds:

- **Shared** (default): `factories/<id>/` + `factories/skills/<id>/SKILL.md`, linked by
  `install.sh`. Commit inside the submodule and push, then commit the new submodule pointer
  (and the symlink) in the project. Other projects get it on their next update.
- **Local** (`local=true`): `factories.local/<id>/` + a real `.claude/skills/<id>/`. Same layout
  as a kit factory, committed in the project only. Its `pipeline.json` opens with
  `"$schema": "../../factories/pipeline.schema.json"` and its `factoryPath` constant is
  `{{rootPath}}/factories.local/{{id}}`.

The validator and the recorder look an id up in `factories.local/<id>/` first, then
`factories/<id>/`; listing ids returns both (local wins on a clash).

Rules a pipeline follows: `skills/create-any-factory/SKILL.md`. How a run is walked:
`skills/any-factory/runner.md`. Hook scripts live in `scripts/` and must work in any project
(exit 0 with a note when their tool is absent): `ai-usage-ingest.sh` (cost attribution),
`aws-preflight.sh` (account, clock, reachability), `frameworks/build-index.py` (the framework
registry index).

## Develop the tools

`bin/validate.mjs` and `bin/state.mjs` are esbuild bundles of `tools/validation` and
`tools/run-state`, **committed**, so consumers run them with plain node. Change the sources,
then:

```sh
cd tools/validation      # or tools/run-state
npm install
npm run check            # typecheck, prettier, tests (incl. tests/bundle.test.ts: the committed bundle is current)
npm run bundle           # rewrites ../../bin/<name>.mjs — commit it with the sources
```

`bash scripts/check-bundles.sh` runs the staleness check of both tools. Each tool's README
says how its rules, guards and commands are organised. Both find the project root from the
working directory (the nearest folder holding `.claude/`, never the kit's own `.git`, which is
a file inside a submodule); the validator's `--root <dir>` overrides it.

Before every push: `bash scripts/check-secrets.sh` (gitleaks when installed, then grep
patterns for keys, tokens, account ids, emails, home paths and private project names). The
kit is public: knowledge files name no project, no account, no person.

## License

MIT, see `LICENSE`.
