# Syver Døving Agdestein — personal website

Astro 7 with Vue scientific figures, six theme palettes, responsive layouts,
and all six existing posts (including the fluid-solver draft).

## Run and validate

Use Node 22.12 or newer. From the repository root:

```sh
npm ci
npm run dev
```

Open http://localhost:4321. Astro 7 runs the development server in the background;
use `npx astro dev stop` to stop it.

```sh
npm run check
npm run build
npm test
npm run preview
```

The static output is `dist/`. `npm test` checks local links, anchors, media,
feeds, historic URLs, and the preserved scientific scripts. It requires Python 3.
In restricted environments, set `ASTRO_TELEMETRY_DISABLED=1` to avoid writing
Astro preferences outside the workspace.

With the production preview running (use the address printed by `npm run preview`):

```sh
TEST_URL=http://localhost:4322 npm run test:browser
```

The browser checks use `/usr/bin/chromium`; override `CHROMIUM_PATH` as needed.
`TEST_URL` selects the preview address (default: port 4321). Legacy redirect
checks require the production build rather than the development server.
The suites cover all six themes,
responsive layouts, local search, keyboard navigation, citations, motion controls,
and the interactive scientific figures.

## Content and design

- `src/content/YYYY-MM-DD-slug.mdx`: the single source for each article's body
  and metadata. Required frontmatter: `title`, `date` (YYYY-MM-DD), `description`.
  Optional: `artwork`, `image` (filename in `public/posts/`), `work`, `draft`.
- `src/pages/posts/[slug].astro`: article routes and contents navigation.
  The time-integration essay has a custom page layout at its matching slug.
- `data/publications.ts`, `data/talks.ts`, `data/cv.ts`: publication, talk, and CV entries.
  The CV file also holds supervision, lectures, service, skills, and languages.
- `src/lib/catalog.ts`: article metadata, search index, and shared content helpers.
- `src/artwork/`: theme-aware SVG entry illustrations.
- `src/styles/theme.css`: interface, scientific-series, and landscape colors.
- `src/components/Scene.astro`: decorative SVG landscapes and static fallback.
- `src/lib/atmosphere.ts`: optional WebGL effects, bounded resolution and offscreen pause.
- `src/lib/site.ts`: persistent themes, motion, navigation, and local search.
- `public/`: article images/video, publication imagery, favicon, and slides.
  Keep scientific image colors and slide deliverables unchanged.

The environments are Aurora, Desert, Coffee, Alpine, Rainforest, and Ocean.
Scientific charts use five shared series colors, supplemented by labels and
line styles. The home demonstration is explicitly illustrative. The article
figures retain their original calculations and stored research data; the website
migration does not independently regenerate the research.

The incomplete fluid-solver draft remains marked as a draft and appears in the
feed as it did previously. Legacy work identifiers remain compatibility metadata
for related papers and social images; they do not create research hub pages.

## URLs and deployment

GitHub Actions checks and builds Astro from the root, then deploys `dist/` to
GitHub Pages on pushes to `main` or manual workflow runs.
Local changes do not deploy until pushed or a workflow is run.

`/feed.xml` and `/sitemap.xml` are generated from the current catalog.
Flat HTML output preserves existing clean and `.html` page URLs.
`scripts/legacy-redirects.mjs` preserves date-only post URLs and research hubs defined in `data/legacy-routes.mjs`. GitHub Pages uses static
redirect documents; each has a canonical target, a no-JavaScript fallback, and
scripted query/fragment preservation. Renamed posts must get an explicit redirect;
never discard a published URL. Redirects are created by `npm run build`, so use
the production preview when checking them.

`tests/scientific-baseline.json` records script hashes captured before the
migration (only relative data-import prefixes are normalized).
`tests/media-baseline.json` records the unchanged article media and slides.
Intentional scientific/media changes need review before updating these fixtures.

See [the migration record](REDESIGN.md) and [remaining tasks](PLAN.md).

## About page

The About page opens with the full studio portrait (`src/assets/about/portrait.jpg`)
in an arched frame. `Portrait.astro` recolors it in CSS for the active theme, so
there is one photograph and no per-theme copies; Astro serves AVIF/WebP sizes.

Each CV chapter pairs its content with an illustrated plate in `src/components/about/`:

| Chapter | Scene |
| --- | --- |
| Employment | `DykeScene`: a crew with pick, shovel, and barrow raising a dyke; a mill turns behind |
| Education | `ForgeScene`: smith and striker at the anvil |
| Teaching & supervision | `StarsScene`: an elder showing a child how the Plough points to Polaris |
| Service & outreach | `RopeScene`: a climber helping a partner over the lip, beside a cairn |
| Skills & languages | `RoadScene`: a journeyman at a signpost greeting in each CV language |

`Plate.astro` paints the sky, so scenes draw only land and figures with the landscape
tokens (`--ridge-*`, `--snow`) plus `--figure`, `--fire`, and `--sun`. Figures come from
`Person.astro`, posed by joint coordinates: feet on y = 0, a standing adult about
100 units tall, facing right unless `flip` is set. The signpost reads its greetings
from `languages` in `data/cv.ts`. The mill, water, sparks, flames, and embers move
only when motion is on; otherwise every scene is a still picture.

## Entry illustrations

Entry artwork is decorative, independent of research-project membership, and
separate from the existing `image` field used for scientific images and metadata.

To add a custom illustration:

1. Add an authored SVG to `src/artwork/`, for example `my-new-idea.svg`.
2. Set `artwork: "my-new-idea"` on the publication, talk, CV, or software entry.
   For a post, use `artwork: my-new-idea` in its MDX frontmatter.
3. Omit `artwork` to use the entry type's default. Unknown filenames also fall
   back to that default and produce a build warning.

No registry edit or component import is needed for each new SVG. The component
loads the local files at build time and embeds the SVG in the page, so theme
changes propagate immediately without additional browser code.

Use `viewBox="0 0 180 150"` with a transparent background. Keep important shapes
inside the viewBox, use rounded strokes around 2–3 units wide, and avoid text
or fine detail that becomes unreadable in the small CV/recent-activity versions.
Treat these as illustrative sketches, not miniature data plots or official logos.

Use these palette variables in SVG `fill` and `stroke` attributes:

| Variable | Purpose |
| --- | --- |
| `var(--art-1)` | Primary theme color |
| `var(--art-2)` | Contrasting second color |
| `var(--art-3)` | Warm or contrasting highlight |
| `var(--art-4)` | Fourth palette color |
| `var(--art-paper)` | Page-colored cutouts and paper surfaces |

Use opacity for washes; avoid hardcoded colors and external images. Prefer SVGs
without IDs/gradient definitions, since the same illustration can appear several
times on a page. SVGs are trusted source files: keep scripts, event handlers,
external resources, and embedded HTML out of generated artwork.

The included sketches are `symmetry`, `time-filter`, `thesis`, `filter-grid`,
`code`, `agents`, `publication`, `talk`, `education`, and `research`.
`EntryArt.astro` selects the fallback by kind and offers large, medium, small,
and tiny sizes. Artwork is hidden from assistive technology because the adjacent
entry text already supplies its meaning.

Institution and software adaptations: `cwi`, `inria-polytechnique`, `tue`, `insa`,
`irt-saint-exupery`, `polytech`, and `ins`. These incorporate recognizable logo
shapes and use the same theme palette. See [sources and adaptations](src/artwork/SOURCES.md).
Nested CV entries can also set `artwork`; entries without it keep their existing
compact text layout. The INS.jl mark is shared by its home feature, software
page, software-suite publication, and development post.

Entry illustrations also include `artery` (branching vessel) and `neuron` for
the blood-flow and diffusion-MRI papers. Institute wordmarks use a single theme
color per mark, without decorative backplates or surrounding accents.
