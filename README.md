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
work/index.html          Work index — Recent work listing, from RecentWork-REF.pdf
work/air-canada/         Case study — Air Canada, from AC-REF.pdf
work/rbc-clear/          Case study — RBC Clear, from RBC-REF.pdf
work/government-of-canada/ Case study — Government of Canada, from Passport-REF.pdf
work/project-one/        Case study template — copy this folder for each new project
about/index.html         About me — from About-REF.pdf, linked from the header avatar
writing/index.html       Writing index — from Writing-REF.pdf
library/index.html       Library — from Library-REF.pdf
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
The Work index was built against `assets/images/RecentWork-REF.pdf`, the Writing
index against `assets/images/Writing-REF.pdf`, About against
`assets/images/About-REF.pdf`, and Library against
`assets/images/Library-REF.pdf`. The Air Canada case study was built
against `assets/images/AC-REF.pdf`, the RBC Clear case study against
`assets/images/RBC-REF.pdf`, and the Government of Canada case study against
`assets/images/Passport-REF.pdf`. All eight share the homepage's palette, type scale,
32px gutter, and 8/32 spacing rhythm.
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

The three 238x108 rail thumbnails and the 222x222 hero portrait stay PNG because their
alpha channel carries baked-in rounded corners matching `--radius-l`.

**Outstanding placeholders.** Everything still awaiting a decision or an asset is marked:

```bash
grep -rn "TODO" --include="*.css" --include="*.html" --include="*.js" .
```

Currently: a favicon and a 1200x630 Open Graph image. The writing cards
link out to the published articles.

**Adding a case study.** Copy `work/project-one/` to `work/<project-slug>/`, update the
content and `<head>` metadata, then add a row to `work/index.html` with an `-RW.webp`
listing image.

## Deploying

The repo is the deployable artifact. Any static host works with no build command:

- **GitHub Pages** — push, then enable Pages on `main`, root folder.
- **Netlify / Vercel** — connect the repo, leave the build command empty, publish
  directory is the repo root.
