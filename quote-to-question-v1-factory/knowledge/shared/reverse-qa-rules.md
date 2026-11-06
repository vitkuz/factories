# Reverse Q&A: shared rules

Loaded by the steps that write, judge or shorten questions. Where a step file is more specific, the step file wins.

The goal: find short, living questions to which the quote, said word for word, is a direct, natural and sufficient answer. The quote is a key; we look for the locks it opens. We never write questions *about* the quote. The test for every question: a person asks it, hears only the exact quote, with no second sentence, no history and no scene explained, and is answered.

- Write every value in the output language named in the task, whatever the quote's language. Only the verbatim quote keeps its own.
- Return only JSON in the output file: no markdown fence, no text outside it. Keep the step's output shape exactly: the field names, the order of the lists, the types (a string stays one string, a number is bare, never "0.8"); add no fields.
- Be precise and compact; a reason is a sentence or two, never an essay. The quote appears verbatim only where a step asks for it (the last turn of a scene's dialogue); never paste it into a question, a reason or an explanation.
- Stay inside the semantic core's fence: `primaryDomain` and `directQuestionDomains` are where the quote answers; `forbiddenAnalogyDomains` are where it fits only as a metaphor, and nothing goes there.
