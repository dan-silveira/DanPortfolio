# Dan's UX Design Portfolio

A static portfolio site built with plain HTML, CSS, and JavaScript. No build step, no
dependencies, no framework — the files in this repo are exactly what gets served.

## Local preview

The site needs to be served over HTTP rather than opened directly as a file, so that
root-relative paths like `/css/tokens.css` resolve correctly.

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Stop the server with `Ctrl+C`. Any file change is picked up on the next page refresh —
there is no watcher or rebuild to wait on.

## Structure

```
index.html              Home
work/index.html          Work index (project grid)
work/project-one/        Case study — copy this folder for each new project
css/
  tokens.css             Design tokens: color, type scale, spacing, radii
  base.css               Reset and element defaults
  layout.css             Container, grid, section rhythm
  components.css         Nav, footer, buttons, project cards
  pages/                 Page-specific styles
js/main.js               Mobile nav, active nav link, scroll reveal
assets/images            Figma exports (raster)
assets/icons             Figma exports (SVG)
assets/fonts             Self-hosted webfonts
```

## Conventions

**Design tokens are the single source of truth.** Colors, font sizes, and spacing are
CSS custom properties declared in `css/tokens.css`. Avoid hard-coding a hex code or a
pixel value in a component stylesheet — add or reuse a token instead. Restyling the site
should mean editing one file.

**Placeholder values are marked.** Any value that still needs to be confirmed against
the Figma file carries a `TODO: confirm` comment. Search for `TODO: confirm` to find
everything outstanding:

```bash
grep -rn "TODO: confirm" --include="*.css" --include="*.html" --include="*.js" .
```

**Adding a case study.** Copy `work/project-one/` to `work/<project-slug>/`, update the
content and `<head>` metadata, then add a matching card to the grid in `work/index.html`.

**Clean URLs.** Pages live at `<name>/index.html` so they are served as `/work/` rather
than `/work.html`. This works without configuration on GitHub Pages, Netlify, and Vercel.

## Deploying

The whole repo is the deployable artifact. Any static host works:

- **GitHub Pages** — push the repo, then enable Pages on the `main` branch, root folder.
- **Netlify / Vercel** — connect the repo, leave the build command empty, set the publish
  directory to the repo root.
