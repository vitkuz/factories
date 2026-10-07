# How a pipeline improvement memo is shaped

The improvement memo is what a pipeline leaves behind about itself after a run: a short,
ranked list of edits to its own prompts, knowledge files and graph that would have made
this run better, written for the person who maintains the pipeline. The memo suggests; a
person applies. The pipeline never edits its own definition, and the memo never re-judges
the work the run produced.

## What to read, in order of how much to trust it

1. **Corrections a person made** to the run's output, when any are on file. The strongest
   signal: a human said what "right" looks like.
2. **What the review sent back** and what it left open. The review is a model's judgment,
   so it is a pointer to where the run went wrong, not proof of what to change. Read the
   review file for the findings, the "Kept" list and the "For the package" notes; read the
   revised outputs to see what the fix cost. A run whose review file holds only its last
   pass has lost the earlier verdicts; say so, and read the revised files for traces of them.
3. **Checks that failed**: a validator error, a build that did not pass, a step that
   returned an error or hit a loop cap. These are facts, not judgments.
4. **The shape of the run**: which steps looped, how many passes each took, which gap the
   final index lists as open. Use the run's state file and cost file when they exist.
5. **A step's own claim that it did well**. Ignore it. A model rating its own work is the
   weakest signal there is.

Then read the pipeline definition the run snapshotted, and the knowledge files it names,
so every suggestion can point at the exact prompt sentence, knowledge paragraph or edge
that should change.

When memos from earlier runs of the same pipeline are on hand, read them before writing.
A symptom that appears in more than one memo is marked **recurring** and its edit ranks
first, because one run is one sample and two runs agreeing is the closest thing to a
pattern the pipeline has. An edit an earlier memo proposed whose symptom has since
disappeared goes under Keep, with the memo it came from; one whose symptom is still here
was either not applied or did not work, and the memo says which it looks like.

## Sections, in this order

1. **Verdict** — first line: one sentence on whether this pipeline needs to change before
   its next run, and the single most important edit if it does.
2. **What went wrong in this run** — three to six lines, each a symptom with a pointer:
   the artifact, the section or finding number, and what the review or the check said.
   No interpretation yet.
3. **Edits** — three or four, ranked by how much of the symptom list each one removes.
   Never more than seven. Each edit has:
   - **Target** — the file and the field or heading: a step's `prompt` or `systemPrompt`,
     a knowledge file and its section, an edge's `max`, a step to add or remove.
   - **Symptom** — which line of section 2 it answers.
   - **Change** — the new text in full, or the itemised delta ("add this sentence after
     …", "raise `max` from 3 to 4"). Never a diff and never a whole-file rewrite; an edit
     that replaces more than a paragraph is two edits or a bad one.
   - **Done when** — how the next run would show the edit worked: a review that does not
     raise the symptom, a check that passes, a pass count that drops.
   - **Confidence** — `high` when two independent artifacts point at it, `medium` when
     one does, `low` when it is inference from the shape of the run alone.
4. **Add** — things the pipeline lacked that no edit above covers: a knowledge file that
   does not exist yet, a check no step runs, a signal nobody records. One line each with
   the artifact that shows the lack.
5. **Keep** — what worked and must not be undone by the edits. Take it from the review's
   "Kept" section and from the steps that passed first time.
6. **Remove** — instruction the run shows to be dead weight: a knowledge paragraph no
   step used, a prompt sentence that every pass ignored. One line each, with why.
7. **Hunches** — anything worth saying that no artifact backs. Labelled as such, so a
   reader never mistakes it for an edit.
8. **How to tell next time** — two or three lines: what to compare between this run and
   the next to know whether the applied edits helped, given that two runs of the same
   pipeline on the same input differ anyway. Name the artifacts to compare.

## Rules

- Every edit points at an artifact in the run. A suggestion with no artifact behind it is
  a hunch and goes in section 7.
- The memo targets the pipeline only: prompts, system prompts, knowledge files, caps,
  edges, steps. It never proposes a change to the run's topic, its findings or its
  reports; those belong to the run, not the pipeline.
- Edits are bounded. A monolithic rewrite of a knowledge file loses what the file already
  gets right; the memo asks for a sentence, a paragraph or a number.
- The memo describes the change; it does not make it. A person reads the memo, applies
  what they agree with and versions the result.
- One run is one sample. Say so. An edit motivated by one review finding is a hypothesis
  about the pipeline, and the "Done when" line is how it gets tested.
- Short: the memo fits on one screen. A reader who wants the evidence opens the artifact
  the memo points at.
