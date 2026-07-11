// A "work" groups the entries that stem from the same piece of research —
// a paper, the talks presenting it, and companion blog posts. Each work gets
// a hub page at /works/<id> (dynamic route in works/[id].md) with the title
// and summary below; the entries share the work's thumbnail image.
//
// Entries opt in by setting `work: "<id>"` (in data/publications.ts,
// data/talks.ts, or post frontmatter); an explicit `image` on the entry
// still wins over the work thumbnail.
//
// New shared thumbnails go in `public/works/`; thumbnails that started life
// as publication images are referenced where they already live.
//
// Object order = display order on the /works/ index (newest first).

export interface Work {
  // Plain-language project title (not the paper title).
  title: string
  // One-paragraph summary for the hub page and the /works/ index.
  summary: string
  image: string // Absolute public path, e.g. "/works/dles15.svg"
}

export const works = {
  // Symmetry-preserving closure comparison
  symmetry: {
    title: "What symmetry buys a learned closure",
    summary:
      "Building the symmetries of the Navier–Stokes equations into a " +
      "neural turbulence closure is standard advice — and rarely tested. " +
      "We compared three architectures, from unconstrained to exactly " +
      "equivariant, and found they all saturate at the same accuracy " +
      "floor: the optimal one-point closure, measurable directly from " +
      "data. The constraints buy the trip to that floor with 25× fewer " +
      "parameters, and a filter-scale Reynolds number input matters more " +
      "for generalization than the architecture itself.",
    image: "/publications/agdesteinComparisonDatadrivenSymmetrypreserving2026.png",
  },
  // Exact unresolved stress expressions (JCP 556)
  exactClosure: {
    title: "The exact unresolved stress",
    summary:
      "A finite-volume discretization is exactly a filter, so the stress " +
      "a coarse simulation leaves unresolved can be written down exactly. " +
      "The result looks different from the classical subgrid stress that " +
      "sixty years of models aim at: it knows the numerical scheme, it is " +
      "not symmetric, and it is not local. Fit a model to this target and " +
      "the a-posteriori error vanishes where classical targets drift.",
    image: "/publications/agdesteinExactExpressionsUnresolved2026.svg",
  },
  // "Time integration as filtering" (DLES15 proceedings)
  dles15: {
    title: "Your time integrator is a filter",
    summary:
      "The discretize-first identity extends to time: a forward-Euler " +
      "step is exactly the derivative of a time-filtered field. At " +
      "practical CFL numbers the time-integration error is the largest " +
      "single term in the coarse-simulation residual — larger than the " +
      "subgrid stress everyone models — and one extra closure term, " +
      "proportional to the time step, accounts for it.",
    image: "/works/dles15.svg",
  },
  // PhD thesis
  thesis: {
    title: "PhD thesis: discrete closure models",
    summary:
      "Four years of the “discretize first, filter next” program in one " +
      "document: treat the grid, the filter, and the numerical scheme as " +
      "part of the physics before any closure modeling takes place. " +
      "Covers divergence-consistent filters, exact unresolved-stress " +
      "expressions, symmetry-preserving architectures, and the " +
      "differentiable software that runs it all.",
    image: "/publications/agdesteinDatadrivenDiscreteClosure2026.png",
  },
  // IncompressibleNavierStokes.jl and the software-suite paper
  suite: {
    title: "A differentiable fluid solver in Julia",
    summary:
      "IncompressibleNavierStokes.jl solves the incompressible " +
      "Navier–Stokes equations with hardware-agnostic kernels compiled " +
      "from a single Julia source, and every discrete operator has a " +
      "hand-written adjoint — so a neural closure model can be trained " +
      "through the solver while embedded in a running LES. Supports " +
      "double-precision DNS up to 840³ on a single GPU.",
    image: "/publications/agdesteinDifferentiableSoftwareSuite2026.png",
  },
  // Divergence-consistent closures (JCP 522)
  divConsistency: {
    title: "Divergence-consistent closure models",
    summary:
      "Filtering the discrete equations instead of the continuous ones " +
      "removes the commutator errors that plague classical LES theory. A " +
      "face-averaging filter keeps the coarse velocity field exactly " +
      "divergence-free, avoids pressure-related instabilities, and makes " +
      "cheap a-priori training sufficient for stable neural LES.",
    image: "/publications/agdesteinDiscretizeFirstFilter2025.svg",
  },
  // "Discretize first, filter next" (ECCOMAS 2022)
  eccomas2022: {
    title: "Discretize first, filter next: the beginning",
    summary:
      "The first outing of the discretize-first idea, on 1D linear " +
      "convection with non-uniform filters: learn the discretely filtered " +
      "operator directly, comparing intrusive and non-intrusive ways of " +
      "doing so. Derivative fitting gave the best trade-off between " +
      "accuracy and practicality.",
    image: "/publications/agdesteinDiscretizeFirstFilter2022.png",
  },
} satisfies Record<string, Work>

export type WorkId = keyof typeof works
