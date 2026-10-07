# Final publishing package

One folder a publisher can work from without opening anything else.

## Per article — its own Markdown file
Front matter, then the final body unchanged:

```yaml
---
title:            # ≤ 70 characters
subtitle:         # the dek, one sentence
slug:             # kebab-case, ≤ 60 characters
meta_description: # 140–160 characters, contains the main keyword
tags: []          # 3–6
reading_time:     # minutes, at 230 wpm
---
```

## The index file
- A table of the articles: title, slug, word count, reading time, file.
- Per article: three alternative headlines, a 2-sentence summary, one
  LinkedIn post (≤ 1,300 characters), one X/Twitter post (≤ 280 characters),
  and a suggested hero-image description.
- A combined, de-duplicated source list.
- Open issues: any fact-check flag the editor could not resolve, verbatim.

Never change article bodies at this stage; packaging only.
