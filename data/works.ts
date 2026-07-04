// A "work" groups the entries that stem from the same piece of research —
// a paper, the talks presenting it, and companion blog posts — so they share
// a single thumbnail image file. Entries opt in by setting `work: "<id>"`
// (in data/publications.ts, data/talks.ts, or post frontmatter); an explicit
// `image` on the entry still wins over the work thumbnail.
//
// New shared thumbnails go in `public/works/`; thumbnails that started life
// as publication images are referenced where they already live.

export interface Work {
  image: string // Absolute public path, e.g. "/works/dles15.svg"
}

export const works = {
  // "Time integration as filtering" (DLES15 proceedings)
  dles15: { image: "/works/dles15.svg" },
  // PhD thesis
  thesis: { image: "/publications/agdesteinDatadrivenDiscreteClosure2026.png" },
  // IncompressibleNavierStokes.jl and the software-suite paper
  suite: { image: "/publications/agdesteinDifferentiableSoftwareSuite2026.png" },
  // Symmetry-preserving closure comparison
  symmetry: { image: "/publications/agdesteinComparisonDatadrivenSymmetrypreserving2026.png" },
  // Exact unresolved stress expressions (JCP 556)
  exactClosure: { image: "/publications/agdesteinExactExpressionsUnresolved2026.svg" },
  // Divergence-consistent closures (JCP 522)
  divConsistency: { image: "/publications/agdesteinDiscretizeFirstFilter2025.svg" },
  // "Discretize first, filter next" (ECCOMAS 2022)
  eccomas2022: { image: "/publications/agdesteinDiscretizeFirstFilter2022.png" },
} satisfies Record<string, Work>

export type WorkId = keyof typeof works
