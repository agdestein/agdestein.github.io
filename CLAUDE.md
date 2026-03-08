# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start local dev server
npm run build     # Build for production (output: .vitepress/dist/)
npm run preview   # Preview production build
```

## Architecture

This is a personal academic website built with [VitePress](https://vitepress.dev/). It deploys automatically to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.

### Content structure

- `index.md` — Home page (VitePress home layout with hero + feature cards)
- `about.md` — CV page
- `publications.md`, `talks.md` — Standalone list pages
- `posts/` — Blog posts, each named `YYYY-MM-DD.md` with frontmatter `title` and `date`
- `public/` — Static assets (images, PDFs for slides, SVG icons)

### Data layer

Static data for publications and talks lives in TypeScript files (not markdown):

- `data/publications.ts` — Exports `publications: Publication[]` with fields: `title`, `authors`, `venue`, `year`, and optional `doi`, `preprintDoi`, `codeUrl`, `image`
- `data/talks.ts` — Exports `talks: Talk[]` with fields: `title`, `venue`, `location`, `date`, and optional `slidesUrl`, `abstractUrl`, `webpageUrl`
- `data/posts.data.ts` — VitePress content loader that globs `posts/20*.md`

### Custom Vue components

Registered globally in `.vitepress/theme/index.ts` and usable directly in any `.md` file:

- `<PublicationList :limit="N" />` — Renders publications from `data/publications.ts`; order is determined by array order in the data file
- `<TalkList :limit="N" />` — Renders talks from `data/talks.ts`; order is determined by array order in the data file
- `<PostList :limit="N" />` — Renders blog posts sorted by `date` frontmatter (newest first)
- `<Figure />` — Custom figure component

### Theme

`.vitepress/theme/index.ts` extends the VitePress default theme and injects the `@nolebase/vitepress-plugin-enhanced-readabilities` menu into the navbar.

### Markdown extensions

- Math rendering via `markdown-it-mathjax3` (enabled with `math: true` in config)
- Footnotes via `markdown-it-footnote`

### Blog post frontmatter

```yaml
---
title: Post title here
date: YYYY-MM-DD
image: /path/to/optional-thumbnail.png  # optional
---
```

### Publication images

Thumbnail images for publications go in `public/publications/` and are referenced by filename only in `data/publications.ts` (e.g., `image: "filename.png"`).

### Slide PDFs

Slide PDFs go in `public/slides/` and are referenced with absolute paths in `data/talks.ts` (e.g., `slidesUrl: "/slides/filename.pdf"`).
