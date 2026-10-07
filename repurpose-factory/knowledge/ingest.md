# Ingesting a source

Turn one source into plain text a writer can work from. Copy, never rewrite.

## By source type
- **YouTube URL** — captions with yt-dlp, no paid API:
  `yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs "en.*,<language code>" --sub-format vtt -o "<scratch>/%(id)s" <url>`
  and `yt-dlp --skip-download --print "%(title)s|%(channel)s|%(upload_date)s|%(duration)s" <url>` for the header.
  Strip VTT timing lines, tags and the rolling duplicates auto-captions repeat. Keep a rough timestamp every ~60 s as `[mm:ss]`.
- **Article URL** — fetch the page; keep the title, author, date and body; drop navigation, ads, comments, related links.
- **Local file** — read it as it is (Markdown, text, a transcript). For PDF, extract the text.

## The file
A header, then the text:

```
# <title>
- Source: <url or path>
- Author / channel: <name>
- Date: <date if known>
- Type: youtube | article | file
- Length: <words> words
```

## Rules
- Never summarise, correct or add. Fix only obvious caption noise (repeated lines, `[Music]`).
- Work in a scratch folder; delete downloaded caption files when done.
- No captions, a paywall, a login wall or under ~150 words of real text is a failure: say why. Never fill the gap from memory or search results.
