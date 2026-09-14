# Dan Silveira — Portfolio

A static portfolio site built with plain HTML, CSS, and JavaScript. No build step, no
dependencies, no framework — the files in this repo are exactly what gets served.

## Local preview

The site must be served over HTTP rather than opened as a file, so that root-relative
paths like `/css/tokens.css` and the `@font-face` sources resolve.

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Stop with `Ctrl+C`. There is no watcher or rebuild —
a page refresh picks up any change.

## Structure

```
index.html               Home — the one page with a finished Figma design
work/index.html          Work index
work/project-one/        Case study — copy this folder for each new project
writing/index.html       Placeholder, not designed yet
library/index.html       Placeholder, not designed yet
css/
  tokens.css             Design tokens: color, type, spacing, geometry
  base.css               @font-face, reset, element defaults
  layout.css             Shell, container, grids, frames
  components.css         Header, nav, rail, cards, buttons, footer
  pages/                 Page-specific styles
js/main.js               Mobile nav, active nav link, sticky header, scroll reveal
assets/fonts             Self-hosted DM Sans and DM Serif Display (woff2)
assets/images            Figma exports plus optimized `-SML` derivatives
```

## Design source of truth

The homepage was built against `assets/images/Homepage-REF.pdf`, a 1280px Figma export.
Its palette, type scale, and geometry were read out of the PDF's vector data rather than
eyeballed, and the exact values live in `css/tokens.css` marked with a `ref` comment:

- Color: `#F7F6F2` background, `#000000` text, `#DEDEDE` dividers, `#CDCDCD` rail rule
- Type: 24px DM Serif Display H1; 20px, 16px, and 14px DM Sans; body on an 18px line
- Frame: 1280 wide, 32 gutters, 914 main column, 302 rail, 56 header

Rendered geometry matches the reference within 3px at 1280px width.

## Conventions

**Tokens are the single source of truth.** Avoid hard-coding a hex code or a pixel value
in a component stylesheet; add or reuse a token instead.

**Heading level and visual weight are separate.** The reference reuses its serif 24px
treatment at three different points in the document outline. Use the correct semantic
heading level and apply `.display` (serif 24) or `.heading` (sans 20 semibold) for the
look, so pages keep a single `h1`.

**DM Serif Display ships Regular only.** Never set a weight above 400 on it or the
browser will synthesize a faux bold.

**Images.** Originals stay untouched; optimized copies carry an `-SML` suffix and are
what the pages reference. Regenerate with `sips`, for example:

```bash
sips -s format jpeg -s formatOptions 82 -z 444 880 Foo-IMG.png --out Foo-IMG-SML.jpg
```

The three 238x108 rail thumbnails stay PNG because their alpha channel carries baked-in
rounded corners.

**Outstanding placeholders.** Everything still awaiting a decision or an asset is marked:

```bash
grep -rn "TODO" --include="*.css" --include="*.html" --include="*.js" .
```

Currently: the hero portrait export, the five rail card destinations, a favicon, and a
1200x630 Open Graph image.

**Adding a case study.** Copy `work/project-one/` to `work/<project-slug>/`, update the
content and `<head>` metadata, then add a card to the grid in `work/index.html`.

## Deploying

The repo is the deployable artifact. Any static host works with no build command:

- **GitHub Pages** — push, then enable Pages on `main`, root folder.
- **Netlify / Vercel** — connect the repo, leave the build command empty, publish
  directory is the repo root.
