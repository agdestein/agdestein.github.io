# Website plan

Goal: a platform that conveys my research more broadly than "publish articles
and attend conferences" — interactive explainers, research-project hubs, and
easy lookup of papers/talks — with room for personal content later.

Assessment (2026-07): the content is distinctive (interactive posts, the
works registry linking paper ↔ talk ↔ post), but the packaging is generic
VitePress docs, and basic findability plumbing (search, meta tags, citations,
feeds) is missing. VitePress itself is not the bottleneck; the default theme
is. Strategy: fix findability first, then replace the default theme with a
custom identity built around works as the central object.

This file is excluded from the built site (`srcExclude` in
`.vitepress/config.ts`).

## Phase 1 — Findability & plumbing (done July 2026, two items pending)

Make the site work well for people looking up my research, without touching
the design.

- [x] Real site `description` + per-page `description` frontmatter
- [x] Open Graph / Twitter meta tags + canonical URLs (`transformHead`),
      og:image from the work/post thumbnail
- [x] Favicon
- [x] Local search (`themeConfig.search`)
- [x] Sitemap (`sitemap.hostname`)
- [x] RSS feed at `/feed.xml` (`buildEnd` + `feed` package), autodiscovery
      link in head
- [x] BibTeX on every publication (`bibtex` field + cite toggle in
      `PublicationList`)
- [x] Dedicated Software page (`software.md`) in the nav
- [x] Slugged post URLs (`YYYY-MM-DD-slug.md`) with redirect stubs at the
      old date-only URLs
- [x] Intro text on the Publications / Talks / Blog list pages
- [x] BibTeX fields verified against the Zotero export (`MyPapers.bib`,
      kept out of git), including the full Ivagnes et al. author list
- [ ] Downloadable CV PDF on the CV page (Syver regenerates it later)
- [ ] Decide fate of the "(Draft)" fluid-solver post (Syver addresses later)

## Phase 2 — Custom identity on VitePress (done July 2026)

Design system: "the paper and the repo" — see CLAUDE.md for the rules.
STIX Two Text for reading, IBM Plex Mono for machinery, color reserved for
the simulation imagery and teal interaction; orange only for "what the
filter erased".

- [x] Deliberate typography/palette in `custom.css` (self-hosted fonts)
- [x] Redesigned home page: masthead ("I study what the filter erases"),
      the `<FilterCut />` DNS-vs-filtered slider as signature element, bio,
      explainer index, recent news
- [x] Docs chrome removed: nolebase plugin, edit link, last-updated display,
      product-style hero/feature cards
- [x] Post pages: date + reading time above the title (`PostMeta` via
      `doc-before` slot)
- [x] Quiet mono site footer (© · rss · source)
- [x] Dark/light verified by screenshot; mobile masthead stacks
- [ ] Possible later: restyle the local-search modal and 404 page to match

## Phase 3 — Works-centric research hubs

Promote the "work" to a first-class page: `/works/<id>` with a plain-language
summary, hero figure/video, and the paper, talks, posts, and code hanging off
it.

- Extend `data/works.ts`: title, summary, hero media, status
- One page per work (dynamic routes or generated md), reusing
  `PublicationList work=` / `TalkList work=` filters
- Publications/talks pages stay as chronological indexes, linking into hubs
- Home page and news feed link to hubs where one exists

## Phase 4 — Personal & non-academic content

- Tags on posts (research / software / notes / personal), filterable post
  list
- A "Beyond research" or "Notes" section once there is content (history,
  languages, piano)
- Keep separate feeds if the audiences diverge (e.g. `/feed.xml` for all,
  `/feed-research.xml` for research only)

## Explicitly deferred

- Migration to Astro or another framework: only if Phase 2/3 hit a real
  VitePress limitation; porting ~15 Vue components and the deploy is
  sideways motion otherwise
- Analytics, comments: not needed for the current goals
