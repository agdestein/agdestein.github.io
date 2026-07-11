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

- `index.md` — Home page (`layout: page` with a custom masthead, the `<FilterCut />` DNS-vs-filtered slider, bio prose, and `<NewsList />`; styled by the `.home` rules in `custom.css`)
- `about.md` — CV page
- `publications.md`, `talks.md`, `software.md` — Standalone list pages
- `posts/` — Blog posts, each named `YYYY-MM-DD-slug.md`, with frontmatter `title`, `date`, and `description` (used for the meta description and Open Graph tags). Lists sort by the `date` frontmatter (newest first), with the filename as tie-breaker for same-day posts. Date-only filenames (`YYYY-MM-DD.md`) are legacy redirect stubs: frontmatter `redirectTo: /posts/<new-slug>` produces a meta refresh (via `transformHead`), and such stubs are excluded from the posts loader and RSS feed. Never delete a stub (old URLs must keep working); when renaming a post, leave one behind.
- `public/` — Static assets (images, PDFs for slides, SVG icons)
- `PLAN.md` — Roadmap for the website redesign (excluded from the build via `srcExclude`)

### Data layer

Static data for publications and talks lives in TypeScript files (not markdown):

- `data/publications.ts` — Exports `publications: Publication[]` with fields: `title`, `authors`, `venue`, `year`, and optional `date` (ISO, news-feed ordering only), `work`, `badges` (label + url chips), `image`, `bibtex` (shown by the "cite" toggle in `PublicationList`)
- `data/talks.ts` — Exports `talks: Talk[]` with fields: `title`, `venue`, `location`, `date`, and optional `work`, `slidesUrl`, `abstractUrl`, `webpageUrl`, `badges` (extra cross-reference chips)
- `data/posts.data.ts` — VitePress content loader that globs `posts/20*.md`; filters out redirect stubs and computes `readingMinutes` per post (raw source is not shipped to the client)
- `data/works.ts` — Registry of "works": a work groups the entries (paper, talks, blog posts) that stem from the same research, so they share one thumbnail file. Entries opt in with `work: "<id>"` (data files or post frontmatter); an explicit `image` still overrides. Shared thumbnails live in `public/works/`. Cross-reference badges between related entries (paper ↔ talk ↔ post) are added manually per entry.

### Custom Vue components

Registered globally in `.vitepress/theme/index.ts` and usable directly in any `.md` file:

- `<PublicationList :limit="N" />` — Renders publications from `data/publications.ts`; order is determined by array order in the data file
- `<TalkList :limit="N" />` — Renders talks from `data/talks.ts`; order is determined by array order in the data file
- `<PostList :limit="N" />` — Renders blog posts sorted by `date` frontmatter (newest first)
- `<NewsList :limit="N" />` — Merged feed of publications, talks, and posts sorted by date (used on the home page); publication dates come from the optional `date` field, talk dates are parsed from the `date` string
- `<Figure />` — Custom figure component
- `<FilterCut />` — Home-page signature: draggable divider between a DNS field and its filtered version (images from `public/posts/symmetry/`)

Two components are injected via layout slots in `.vitepress/theme/index.ts` rather than used in markdown: `PostMeta` (date + reading time above blog post titles, `doc-before` slot) and `SiteFooter` (`layout-bottom` slot).

### Theme & design system

`.vitepress/theme/index.ts` extends the VitePress default theme. The visual identity ("the paper and the repo") lives in `.vitepress/theme/custom.css`:

- Everything you *read* is STIX Two Text (serif, pairs with MathJax); everything that is *machinery* — nav, dates, badges, section labels — is IBM Plex Mono. Both are self-hosted via `@fontsource` packages imported in `theme/index.ts`.
- Color is reserved for data (the red/blue simulation imagery) and interaction (teal `--vp-c-brand-*`). `--sda-erased` (orange) is a semantic accent for "what the filter erased" — do not use it decoratively.
- Light mode is cool paper white (`#fcfcfa`), dark mode deep blue-slate (`#0f172a`); keep both working when styling anything new.

### SEO & feeds (in `.vitepress/config.ts`)

- `transformHead` adds canonical URLs and Open Graph/Twitter meta to every page; og:image resolves from post frontmatter `image`, then `work` thumbnail, then the logo. Pages with frontmatter `redirectTo` get a meta refresh instead.
- `buildEnd` writes an RSS feed of posts to `/feed.xml` (uses the `feed` package).
- Sitemap and local search are enabled; per-page `description` frontmatter feeds both the meta description and og:description.

### Markdown extensions

- Math rendering via `markdown-it-mathjax3` (enabled with `math: true` in config)
- Footnotes via `markdown-it-footnote`

### Blog post frontmatter

```yaml
---
title: Post title here
date: YYYY-MM-DD
description: One or two sentences for meta description and Open Graph.
image: filename.png  # optional; bare filename, placed in public/posts/
work: workId         # optional; thumbnail from data/works.ts (image overrides)
---
```

### Publication images

Thumbnail images for publications go in `public/publications/` and are referenced by filename only in `data/publications.ts` (e.g., `image: "filename.png"`).

### Slide PDFs

Slide PDFs go in `public/slides/` and are referenced with absolute paths in `data/talks.ts` (e.g., `slidesUrl: "/slides/filename.pdf"`).
