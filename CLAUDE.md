# Website project guidance

This repository is Syver's personal website, built with Astro 7 and Vue islands.
The application lives at the repository root. There is no separate prototype or
VitePress build. Read README.md for content authoring and artwork conventions.

## Commands

- `npm ci`: install the locked dependencies (Node >=22.12).
- `npm run dev`: local Astro server at http://localhost:4321.
- `npx astro dev stop`: stop Astro's background development server.
- `npm run check`: Astro/TypeScript diagnostics.
- `npm run build`: static Astro output plus legacy redirects in dist/.
- `npm test`: scientific-script, media, link, feed, sitemap, and compatibility checks.
- `npm run test:browser`: browser acceptance tests against a running server.
  TEST_URL and CHROMIUM_PATH override the defaults.
- `npm run preview`: serve the production output.

Set ASTRO_TELEMETRY_DISABLED=1 in restricted environments.

## Structure

- src/pages/: Home, Writing, Publications, Talks, Software, About/CV, and 404.
- src/content/: one MDX source per post, including its frontmatter metadata.
- src/lib/catalog.ts: publications/talks and MDX metadata, search, date helpers.
- data/: publications, talks, CV, original scientific JSON, legacy work metadata.
- src/components/: Vue scientific figures and Astro layout/entry components.
- src/styles/: layout, article styling, and shared theme palette tokens.
- src/artwork/: trusted inline SVG decorations, with optional entry artwork keys.
- public/: linked media, favicon, and self-contained slide HTML/PDF deliverables.
- scripts/legacy-redirects.mjs and data/legacy-routes.mjs: old URL compatibility.
- .github/workflows/deploy.yml: checks/builds root Astro and deploys dist/ on main.

## Content and visual rules

Preserve publication URLs. A renamed post or removed page needs a redirect.
The old .html, date-only post, and research-hub URLs remain supported.
RSS and sitemap are generated endpoints; never put manual copies in public/.

Themes affect colors and decorative atmosphere, not scientific data or equations.
Use shared series tokens plus labels/line styles for charts. Preserve original
research rasters and clearly label illustrative demonstrations.
All six environments need a static fallback and reduced-motion support.
Keep mobile layouts readable; dense equations/plots may scroll internally,
never overflow the whole page.

Original scientific scripts and published slide/media assets have baseline
checks. Do not update these merely to silence a failure: inspect and explain any
intentional scientific or asset change first.

Entry artwork is separate from scientific images and work associations.
Use src/artwork/SOURCES.md for logo references. Institution lettering uses one
color within each logo; different logos may use different theme palette colors.

Do not commit, push, or deploy unless requested. The normal deployment workflow
runs automatically on a push to main.
