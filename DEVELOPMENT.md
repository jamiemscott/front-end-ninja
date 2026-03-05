# Front-End Ninja — Development Guide

## CSS Build

CSS is authored as SMACSS partials in `assets/styles/` and bundled into a single minified file using [lightningcss](https://lightningcss.dev/).

The HTML references `assets/styles/bundle.css` — **never edit this file directly**.

### Commands

```bash
# Install dependencies (first time only)
npm install

# One-off build
npm run build:css

# Watch mode — rebuilds on every save
npm run watch:css
```

### Workflow

1. Edit CSS partials in `assets/styles/`
2. Run `npm run build:css` (or keep `watch:css` running in a terminal)
3. Commit both your changed partials **and** the updated `bundle.css`

## Deployment (Netlify)

Pushing to `main` triggers an automatic Netlify deploy. The build command in `netlify.toml` runs `npm run build:css` before publishing, so `bundle.css` is always regenerated fresh from the partials.

No manual deploy steps required — just push to GitHub.

## CSS Architecture

Partials are organised following [SMACSS](http://smacss.com/) principles with CSS `@layer` for cascade control.

**Layer order** (lowest → highest priority):

```
base → layout → modules → state
```

**File structure:**

```
assets/styles/
  main.css              ← entry point, all @imports here
  bundle.css            ← built output (do not edit)
  base/
    fonts.css           ← @font-face declarations (self-hosted woff2)
    variables.css       ← design tokens (--neon-cyan, --dark-void, etc.)
    reset.css           ← browser reset
    typography.css      ← body/html, font-family, scrollbar
  layout/
    grid.css            ← .container, .section, .section-header
    header.css          ← .site-header, .site-nav
    hero.css            ← .hero-grid, photo panel, glitch, stats
    footer.css          ← .site-footer
  modules/
    effects.css         ← body grid/scanlines, cursor, glow orbs
    card.css            ← .skill-card, .project-card
    button.css          ← .btn-primary, .btn-secondary
    badge.css           ← .badge
    timeline.css        ← .timeline, .timeline-item
    contact.css         ← .contact-panel, form
  state/
    states.css          ← .is-hidden, .fade-in, .skip-link

assets/fonts/           ← self-hosted woff2 files
```
