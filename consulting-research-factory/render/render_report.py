#!/usr/bin/env python3
"""Render a consulting report (Markdown with ```vega-lite blocks) to one standalone HTML page.

Usage: python3 render_report.py <report.md> <report.html>

No Python dependencies. The page loads marked and vega-embed from jsDelivr when opened,
turns the Markdown into HTML and draws every vega-lite block as a chart.
"""
import html
import json
import re
import sys
from pathlib import Path

TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/marked@12/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@5"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>
<style>
  :root {
    --bg: #ffffff; --ink: #1a1f2b; --muted: #5b6475; --rule: #d9dde3;
    --accent: #0b3d91; --panel: #f5f7fa;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --bg: #11151c; --ink: #e6e9ef; --muted: #9aa3b2; --rule: #2a3140;
      --accent: #7fa7ff; --panel: #181e28;
    }
  }
  :root[data-theme="dark"] {
    --bg: #11151c; --ink: #e6e9ef; --muted: #9aa3b2; --rule: #2a3140;
    --accent: #7fa7ff; --panel: #181e28;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink);
         font: 17px/1.6 "Source Serif 4", Georgia, serif; }
  main { max-width: 780px; margin: 0 auto; padding: 48px 16px 96px; }
  h1, h2, h3, h4 { font-family: Inter, system-ui, sans-serif; line-height: 1.25; }
  h1 { font-size: 2.1rem; color: var(--accent); margin: 0 0 .4em; }
  h1 + p em { font-size: 1.15rem; color: var(--muted); }
  h2 { font-size: 1.45rem; margin-top: 2.4em; padding-top: .8em; border-top: 3px solid var(--accent); }
  h3 { font-size: 1.1rem; margin-top: 1.8em; }
  a { color: var(--accent); overflow-wrap: anywhere; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; font: 14px/1.4 Inter, sans-serif;
          display: block; overflow-x: auto; }
  th, td { border-bottom: 1px solid var(--rule); padding: 6px 8px; text-align: left; vertical-align: top; }
  th { border-bottom: 2px solid var(--ink); }
  blockquote { margin: 1.5em 0; padding: 12px 18px; background: var(--panel);
               border-left: 4px solid var(--accent); }
  code { font-size: .88em; }
  pre { background: var(--panel); padding: 12px; overflow-x: auto; }
  .exhibit-chart { width: 100%; margin: 12px 0; }
  .exhibit-chart .vega-embed { width: 100%; }
  h3[id^="exhibit"] { color: var(--muted); font-size: .8rem;
          text-transform: uppercase; letter-spacing: .08em; margin-bottom: .2em; }
  p:has(> strong:only-child) { margin-bottom: .2em; }
  @media print { main { max-width: none; } h2 { break-before: page; } }
</style>
</head>
<body>
<main id="report"><noscript>This page needs JavaScript to render. The Markdown source is report.md.</noscript></main>
<script id="report-source" type="application/json">__SOURCE__</script>
<script>
  const source = JSON.parse(document.getElementById('report-source').textContent);
  const root = document.getElementById('report');
  const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  try {
    root.innerHTML = marked.parse(source, { breaks: true, gfm: true });
  } catch (e) {
    root.textContent = source;
  }
  root.querySelectorAll('h1,h2,h3').forEach((h) => { h.id = slug(h.textContent); });
  root.querySelectorAll('pre > code.language-vega-lite').forEach((code) => {
    const pre = code.parentElement;
    const holder = document.createElement('div');
    holder.className = 'exhibit-chart';
    pre.replaceWith(holder);
    try {
      const spec = JSON.parse(code.textContent);
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      vegaEmbed(holder, spec, { actions: false, renderer: 'svg', theme: dark ? 'dark' : undefined })
        .catch(() => holder.replaceWith(pre));
    } catch (e) {
      holder.replaceWith(pre);
    }
  });
</script>
</body>
</html>
"""


def title_of(markdown: str) -> str:
    match = re.search(r"^#\s+(.+)$", markdown, flags=re.MULTILINE)
    return match.group(1).strip() if match else "Consulting report"


def render(markdown: str) -> str:
    source = json.dumps(markdown).replace("</", "<\\/")
    return TEMPLATE.replace("__TITLE__", html.escape(title_of(markdown))).replace("__SOURCE__", source)


def main(argv: list) -> int:
    if len(argv) != 3:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    src, dst = Path(argv[1]), Path(argv[2])
    if not src.is_file():
        print(f"report not found: {src}", file=sys.stderr)
        return 1
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(render(src.read_text(encoding="utf-8")), encoding="utf-8")
    print(f"wrote {dst}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
