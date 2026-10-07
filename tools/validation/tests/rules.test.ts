import { describe, expect, it } from 'vitest';
import type { Pipeline } from '../src/features/pipeline/pipeline.types.js';
import { PIPELINE_RULES, SETUP_RULES, runRules } from '../src/features/rules/index.js';
import type { PipelineRule } from '../src/features/rules/index.js';
import { anchorsFirst } from '../src/features/rules/pipeline/anchors-first.rule.js';
import { endReachable } from '../src/features/rules/pipeline/end-reachable.rule.js';
import { humanStep } from '../src/features/rules/pipeline/human-step.rule.js';
import { idMatchesFolder } from '../src/features/rules/pipeline/id-matches-folder.rule.js';
import { knowledgeExists } from '../src/features/rules/pipeline/knowledge-exists.rule.js';
import { loopsCapped } from '../src/features/rules/pipeline/loops-capped.rule.js';
import { outputDirNotRecursive } from '../src/features/rules/pipeline/output-dir-not-recursive.rule.js';
import { placeholdersDeclared } from '../src/features/rules/pipeline/placeholders-declared.rule.js';
import { schemaRef } from '../src/features/rules/pipeline/schema-ref.rule.js';
import { startExists } from '../src/features/rules/pipeline/start-exists.rule.js';
import { stepsReachable } from '../src/features/rules/pipeline/steps-reachable.rule.js';
import { targetsExist } from '../src/features/rules/pipeline/targets-exist.rule.js';
import { wrapperSkillExists } from '../src/features/rules/pipeline/wrapper-skill-exists.rule.js';
import { cwdIsRoot } from '../src/features/rules/setup/cwd-is-root.rule.js';
import {
  FILE,
  LOCAL_FILE,
  ROOT,
  basePipeline,
  contextFor,
  memoryFileSystem,
  messages,
} from './helpers.js';

/** Run one rule against the base pipeline after `change` edits a copy of it. */
const check =
  (rule: PipelineRule) =>
  (change: (pipeline: Pipeline) => void = (): void => undefined): string[] => {
    const pipeline: Pipeline = structuredClone(basePipeline());
    change(pipeline);
    return messages(rule.check(contextFor(pipeline)));
  };

describe('the registry', () => {
  it('has unique kebab-case ids', () => {
    const ids: string[] = [...SETUP_RULES, ...PIPELINE_RULES].map((rule) => rule.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/));
  });

  it('finds nothing in a healthy pipeline', () => {
    expect(messages(runRules(PIPELINE_RULES)(contextFor(basePipeline())))).toEqual([]);
  });
});

describe('graph rules', () => {
  it('start-exists', () => {
    expect(check(startExists)()).toEqual([]);
    expect(check(startExists)((p) => (p.START = ['ghost']))).toEqual([
      'error: START: "ghost" is not a step',
      'error: START names no declared step, so nothing can run',
    ]);
  });

  it('targets-exist', () => {
    expect(
      check(targetsExist)((p) => (p.steps['draft']!.transitions['DONE']!.target = ['nope'])),
    ).toEqual(['error: steps.draft.transitions.DONE.target: "nope" is not a step or END']);
    expect(
      check(targetsExist)((p) => (p.steps['review']!.transitions['REVISE']!.onMax = ['gone'])),
    ).toEqual(['error: steps.review.transitions.REVISE.onMax: "gone" is not a step or END']);
  });

  it('steps-reachable', () => {
    expect(
      check(stepsReachable)((p) => {
        p.steps['orphan'] = {
          agent: 'a',
          prompt: ['x'],
          transitions: { DONE: { target: ['END'] } },
        };
      }),
    ).toEqual(['error: steps.orphan: not reachable from START']);
  });

  it('end-reachable', () => {
    expect(
      check(endReachable)((p) => {
        p.steps['review']!.transitions = { REVISE: { target: ['draft'] } };
      }),
    ).toEqual(['error: END is not reachable from START: the run can never finish']);
  });

  it('loops-capped', () => {
    expect(check(loopsCapped)()).toEqual([]);
    expect(check(loopsCapped)((p) => delete p.steps['review']!.transitions['REVISE']!.max)).toEqual(
      [
        'warning: loop without a "max": draft:DONE -> review:REVISE -> draft — that loop can spin forever',
      ],
    );
  });

  it('human-step', () => {
    expect(
      check(humanStep)((p) => {
        p.steps['review']!.agent = 'human';
        p.steps['review']!.model = 'opus';
      }),
    ).toEqual([
      'error: steps.review: a human step needs an output file',
      'warning: steps.review: "model" is ignored on a human step',
    ]);
  });
});

describe('names and paths', () => {
  it('placeholders-declared', () => {
    expect(check(placeholdersDeclared)((p) => p.steps['draft']!.prompt.push('{{nope}}'))).toEqual([
      'error: pipeline.steps.draft.prompt[1]: {{nope}} is not a param, a constant or a built-in (id, slug, date, outputDir)',
    ]);
  });

  it('output-dir-not-recursive', () => {
    expect(check(outputDirNotRecursive)((p) => (p.outputDir = '{{outputDir}}/x'))).toEqual([
      'error: outputDir cannot use {{outputDir}}: it is resolved from this value',
    ]);
  });

  it('knowledge-exists', () => {
    expect(check(knowledgeExists)()).toEqual([]);
    expect(
      check(knowledgeExists)(
        (p) => (p.steps['draft']!.knowledge = ['{{factoryPath}}/knowledge/gone.md']),
      ),
    ).toEqual([
      'error: steps.draft.knowledge: "{{factoryPath}}/knowledge/gone.md" does not exist (/repo/factories/demo-factory/knowledge/gone.md)',
    ]);
    expect(
      check(knowledgeExists)((p) => (p.steps['draft']!.knowledge = ['{{topic}}/x.md'])),
    ).toEqual([
      'warning: steps.draft.knowledge: "{{topic}}/x.md" uses a run-time variable and cannot be checked before the run',
    ]);
    expect(
      check(knowledgeExists)(
        (p) => (p.steps['draft']!.knowledge = ['{{factoryPath}}/knowledge/*.md']),
      ),
    ).toEqual([]);
  });

  it('knowledge-exists: a missing file under factory-data/ is project data, a warning', () => {
    expect(
      check(knowledgeExists)(
        (p) => (p.steps['draft']!.knowledge = ['{{rootPath}}/factory-data/{{id}}/lessons.md']),
      ),
    ).toEqual([
      'warning: steps.draft.knowledge: "{{rootPath}}/factory-data/{{id}}/lessons.md" is project data not created yet (/repo/factory-data/demo-factory/lessons.md); the run reads it as empty',
    ]);
    const findings = knowledgeExists.check(
      contextFor(
        {
          ...basePipeline(),
          steps: {
            ...basePipeline().steps,
            draft: {
              ...basePipeline().steps['draft']!,
              knowledge: ['{{rootPath}}/factory-data/{{id}}/lessons.md'],
            },
          },
        },
        { fileSystem: memoryFileSystem([`${ROOT}/factory-data/demo-factory/lessons.md`]) },
      ),
    );
    expect(findings).toEqual([]);
  });
});

describe('conventions', () => {
  it('anchors-first reads the order as written', () => {
    const pipeline: Pipeline = basePipeline();
    const document = { ...pipeline, constants: { skillPath: '.', rootPath: 'cwd', homePath: '~' } };
    expect(messages(anchorsFirst.check(contextFor(pipeline, { document })))).toEqual([
      'warning: constants should open with rootPath, skillPath, homePath in that order',
    ]);
  });

  it('schema-ref', () => {
    expect(check(schemaRef)()).toEqual([]);
    expect(check(schemaRef)((p) => delete p.$schema)).toEqual([
      'warning: "$schema" should point at the shared schema ("../pipeline.schema.json"), got undefined',
    ]);
  });

  it('id-matches-folder', () => {
    expect(check(idMatchesFolder)((p) => (p.id = 'other-factory'))).toEqual([
      'warning: id "other-factory" does not match its folder: expected /repo/factories/other-factory/pipeline.json',
    ]);
  });

  it('a pipeline under factories.local/ is at home there, with its own schema path', () => {
    const local = (pipeline: Pipeline) => contextFor(pipeline, { file: LOCAL_FILE });
    expect(messages(idMatchesFolder.check(local(basePipeline())))).toEqual([]);
    expect(
      messages(idMatchesFolder.check(local({ ...basePipeline(), id: 'other-factory' }))),
    ).toEqual([
      'warning: id "other-factory" does not match its folder: expected /repo/factories.local/other-factory/pipeline.json',
    ]);
    expect(
      messages(
        schemaRef.check(
          local({ ...basePipeline(), $schema: '../../factories/pipeline.schema.json' }),
        ),
      ),
    ).toEqual([]);
    expect(messages(schemaRef.check(local(basePipeline())))).toEqual([
      'warning: "$schema" should point at the shared schema ("../../factories/pipeline.schema.json"), got "../pipeline.schema.json"',
    ]);
    expect(
      messages(
        idMatchesFolder.check(contextFor(basePipeline(), { file: '/elsewhere/pipeline.json' })),
      ),
    ).toEqual([]);
  });

  it('wrapper-skill-exists', () => {
    const findings = wrapperSkillExists.check(
      contextFor(basePipeline(), { fileSystem: memoryFileSystem([FILE]) }),
    );
    expect(messages(findings)).toEqual([
      'warning: no wrapper skill folder /repo/.claude/skills/demo-factory: {{skillPath}} resolves there, and /demo-factory has no skill to hand off to any-factory',
    ]);
  });
});

describe('setup rules', () => {
  it('cwd-is-root', () => {
    expect(messages(cwdIsRoot.check(contextFor(basePipeline(), { cwd: '/elsewhere' })))).toEqual([
      'warning: working directory /elsewhere is not {{rootPath}} /repo: run from the repository root, as the harness does',
    ]);
  });
});
