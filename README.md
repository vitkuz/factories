# factories

A kit of Claude Code **factories**: multi-step subagent pipelines, each a graph in
`<id>/pipeline.json` with its knowledge beside it. The kit is one of three repositories a
project mounts as git submodules, with mount names equal to repository names:

| Mount | Repository | Holds | Changes when |
|---|---|---|---|
| `factories/` | `vitkuz/factories` (this one) | the pipeline graphs and their knowledge, `pipeline.schema.json`, `state.schema.json`, the hook scripts | you add or tune a factory |
| `factories-tools/` | [`vitkuz/factories-tools`](https://github.com/vitkuz/factories-tools) | the validator and run recorder (`bin/validate.mjs`, `bin/state.mjs`, plain node), the headless runners, the diagram CLI, the Studio, `ai-usage` | tool code changes |
| `factories-skills/` | [`vitkuz/factories-skills`](https://github.com/vitkuz/factories-skills) | `any-factory` (the runner skill), `create-any-factory`, `draw-factory`, one wrapper skill per factory, `install.sh` | instructions change |

The three depend on each other only through **file contracts** (paths and JSON shapes), never
shared code. Nothing in this repository needs `npm install`.

```
factories/                       the kit (this repository) as a project sees it
├── <id>/pipeline.json           one factory: params, constants, hooks, steps, edges
│   └── knowledge/               what its steps read (methods, templates, checklists)
├── pipeline.schema.json         the shape of a pipeline.json (editor autocomplete; the tools keep a Zod twin)
├── state.schema.json            the shape of a run's state.json
└── scripts/                     hook scripts every pipeline may call ({{rootPath}}/factories/scripts/…), the secret check
```

The factories: `adaptive-research-factory`, `aws-architecture-factory`,
`consulting-research-factory`, `feature-factory`, `mckinsey-research-factory`,
`quick-research-factory`, `repurpose-factory`, `sdlc-factory`,
`strategy-research-factory`, `write-articles-factory`. Each wrapper skill's
description (in `factories-skills/<id>/SKILL.md`) says what it does; `/<id> name=value …` runs it.

## Add the kit to a project

From the project root (the folder holding `.claude/`), mount all three:

```sh
git submodule add -b main git@github-personal:vitkuz/factories.git factories
git submodule add -b main git@github-personal:vitkuz/factories-tools.git factories-tools
git submodule add -b main git@github-personal:vitkuz/factories-skills.git factories-skills
bash factories-skills/install.sh           # .claude/skills/<name> -> ../../factories-skills/<name>
node factories-tools/bin/validate.mjs      # lists the ids; node 20+, nothing to install
git add .gitmodules factories factories-tools factories-skills .claude/skills
git commit -m "Add the factories kit"
```

A fresh clone of the project needs `git submodule update --init factories factories-tools factories-skills`
(or `git clone --recurse-submodules`) and `bash factories-skills/install.sh` once. `install.sh` is
idempotent: it never overwrites a `.claude/skills/<name>` that is not already its own symlink (it lists
those and goes on), and it says which of the three mounts is missing; `--dry-run` shows what it would do.

Where things land in the project:

| Path | What |
|---|---|
| `run/<id>/<slug>-<date>/` | one run: the steps' outputs, `state.json`, `pipeline.json` snapshot |
| `factories-data/<id>/` | what a factory keeps across runs (insight stores, lessons, a project map); runs never write inside `factories/` |
| `improvements/<id>/` | improvement memos some factories collect |
| `factories.local/<id>/` | the project's own factories (below) |

`feature-factory` needs a project map at `factories-data/feature-factory/project-map.md`
(start from `factories/feature-factory/knowledge/project/project-map.template.md`) and takes
the project's `tenant`, `project`, `awsAccount`, `awsProfile` as params; a project keeps a
real `.claude/skills/feature-factory/SKILL.md` of its own to pass them (install.sh leaves it
alone). The `hooks.after` cost attribution needs the `ai-usage` tool (`factories-tools/ai-usage`,
built); without it the hook prints one line and exits 0.

## Update the kit in a project

```sh
git submodule update --remote factories factories-tools factories-skills
bash factories-skills/install.sh           # new wrapper skills, if any
git add factories factories-tools factories-skills .claude/skills && git commit -m "Bump the factories kit"
```

Bump `factories-tools` first, `factories` second: a newer pipeline shape needs the tools that
understand it.

## Add a factory

`/create-any-factory <description of the steps>` drafts, writes and validates it. Two kinds:

- **Shared** (default): the graph `factories/<id>/` here, the wrapper `factories-skills/<id>/SKILL.md`
  in the skills repository, linked by `install.sh`. Two commits (one in each submodule, pushed), then
  the two submodule pointers and the symlink in the project. Other projects get it on their next update.
- **Local** (`local=true`): `factories.local/<id>/` + a real `.claude/skills/<id>/`. Same layout
  as a kit factory, committed in the project only. Its `pipeline.json` opens with
  `"$schema": "../../factories/pipeline.schema.json"` and its `factoryPath` constant is
  `{{rootPath}}/factories.local/{{id}}`.

The validator and the recorder look an id up in `factories.local/<id>/` first, then
`factories/<id>/`; listing ids returns both (local wins on a clash).

Rules a pipeline follows: `factories-skills/create-any-factory/SKILL.md`. How a run is walked:
`factories-skills/any-factory/runner.md`. Hook scripts live in `scripts/` here and must work in any
project (exit 0 with a note when their tool is absent): `ai-usage-ingest.sh` (cost attribution),
`aws-preflight.sh` (account, clock, reachability), `frameworks/build-index.py` (the framework
registry index). A pipeline calls them as `bash {{rootPath}}/factories/scripts/<name>`.

## The contract this repository keeps

- A factory's folder is `factories/<id>/`, and `pipeline.json` is its first file. Its `$schema` is
  `../pipeline.schema.json`. Nothing outside `factories/<id>/` is written by a run.
- `pipeline.schema.json` and `state.schema.json` are the shapes the tools validate against; the
  tools' Zod twins are checked against these files in their tests.
- Before every push: `bash scripts/check-secrets.sh` (gitleaks when installed, then grep patterns
  for keys, tokens, account ids, emails, home paths and the owner's private project names). The
  kit is public: knowledge files name no project, no account, no person.

## License

MIT, see `LICENSE`.
