import type { WorkId } from './works'

export interface Badge {
  label: string
  url: string
  emphasized?: boolean
}

export interface Publication {
  title: string
  authors: string
  venue: string
  year: number
  // ISO date (YYYY-MM or YYYY-MM-DD) used only for ordering in the news feed;
  // `year` remains the displayed value.
  date?: string
  // Shared work id (see data/works.ts) for the thumbnail; `image` overrides.
  work?: WorkId
  badges?: Badge[]
  image?: string
}

export const publications: Publication[] = [
  {
    title: "Time integration as filtering: a space-time discretization-aware LES formulation",
    authors: "Syver Døving Agdestein",
    venue: "arXiv preprint",
    year: 2026,
    date: "2026-06",
    work: "dles15",
    badges: [
      { label: "preprint", url: "https://doi.org/10.48550/arXiv.2606.17759", emphasized: true },
      { label: "code", url: "https://github.com/agdestein/DLES15CompanionCode" },
      { label: "blog post", url: "/posts/2026-07-04" },
      { label: "slides", url: "/slides/20260521-DLES.pdf" },
    ],
  },
  {
    title: "Data-driven discrete closure models for large-eddy simulation of incompressible turbulence",
    authors: "Syver Døving Agdestein",
    venue: "PhD thesis",
    year: 2026,
    date: "2026-06", // TODO(syver): set the defense date
    work: "thesis",
    badges: [
      { label: "thesis", url: "https://research.tue.nl/en/publications/data-driven-discrete-closure-models-for-large-eddy-simulation-of-/", emphasized: true },
      { label: "slides", url: "/slides/20260702-Bernoulli.pdf" },
    ],
  },
  {
    title: "A differentiable software suite for accelerated simulation of turbulent flows",
    authors: "Syver Døving Agdestein and Benjamin Sanderse",
    venue: "arXiv preprint",
    year: 2026,
    date: "2026-04",
    work: "suite",
    badges: [
      { label: "preprint", url: "https://doi.org/10.48550/arXiv.2604.18536", emphasized: true },
      { label: "code", url: "https://github.com/agdestein/IncompressibleNavierStokes.jl" },
      { label: "blog post", url: "/posts/2024-10-06" },
    ],
  },
  {
    title: "Comparison of Data-Driven Symmetry-Preserving Closure Models for Large-Eddy Simulation",
    authors: "Syver Døving Agdestein and Benjamin Sanderse",
    venue: "arXiv preprint",
    year: 2026,
    date: "2026-03",
    work: "symmetry",
    badges: [
      { label: "preprint", url: "https://doi.org/10.48550/arXiv.2603.05325", emphasized: true },
      { label: "code", url: "https://github.com/agdestein/SymmetryCode.jl" },
      { label: "slides", url: "/slides/20260304-ML4FLUIDS.pdf" },
    ],
  },
  {
    title: "Exact Expressions for the Unresolved Stress in a Finite-Volume Based Large-Eddy Simulation",
    authors: "Syver Døving Agdestein, Roel Verstappen, and Benjamin Sanderse",
    venue: "Journal of Computational Physics 556",
    year: 2026,
    date: "2026-01", // TODO(syver): set the publication date
    badges: [
      { label: "paper", url: "https://doi.org/10.1016/j.jcp.2026.114810", emphasized: true },
      { label: "preprint", url: "https://doi.org/10.48550/arXiv.2507.17051" },
      { label: "code", url: "https://github.com/agdestein/ExactClosure.jl" },
    ],
    image: "agdesteinExactExpressionsUnresolved2026.svg",
  },
  {
    title: "A New Data-Driven Energy-Stable Evolve-Filter-Relax Model for Turbulent Flow Simulation",
    authors: "Anna Ivagnes et al.",
    venue: "Computer Methods in Applied Mechanics and Engineering 450",
    year: 2026,
    date: "2025-12", // TODO(syver): set the publication date
    badges: [
      { label: "paper", url: "https://doi.org/10.1016/j.cma.2025.118654", emphasized: true },
      { label: "preprint", url: "https://doi.org/10.48550/arXiv.2507.17423" },
    ],
    image: "ivagnesNewDatadrivenEnergystable2026.png",
  },
  {
    title: "Discretize First, Filter next: Learning Divergence-Consistent Closure Models for Large-Eddy Simulation",
    authors: "Syver Døving Agdestein and Benjamin Sanderse",
    venue: "Journal of Computational Physics 522",
    year: 2025,
    date: "2024-11",
    work: "divConsistency",
    badges: [
      { label: "paper", url: "https://doi.org/10.1016/j.jcp.2024.113577", emphasized: true },
      { label: "preprint", url: "https://doi.org/10.48550/arXiv.2403.18088" },
      { label: "code", url: "https://github.com/agdestein/DivergenceConsistency" },
    ],
  },
  {
    title: "Discretize First, Filter next – a New Closure Model Approach",
    authors: "Syver Døving Agdestein and Benjamin Sanderse",
    venue: "8th European Congress on Computational Methods in Applied Sciences and Engineering (ECCOMAS)",
    year: 2022,
    date: "2022-08",
    work: "eccomas2022",
    badges: [
      { label: "paper", url: "https://doi.org/10.23967/eccomas.2022.094", emphasized: true },
      { label: "preprint", url: "https://doi.org/10.48550/arXiv.2208.09363" },
      { label: "code", url: "https://github.com/agdestein/DiscreteFiltering.jl" },
    ],
  },
  {
    title: "Practical Computation of the Diffusion MRI Signal Based on Laplace Eigenfunctions: Permeable Interfaces",
    authors: "Syver Døving Agdestein, Try Nguyen Tran, and Jing-Rebecca Li",
    venue: "NMR in Biomedicine 35.3",
    year: 2022,
    date: "2022-03",
    badges: [
      { label: "paper", url: "https://doi.org/10.1002/nbm.4646", emphasized: true },
      { label: "code", url: "https://github.com/SpinDoctorMRI/SpinDoctor" },
    ],
    image: "agdesteinPracticalComputationDiffusion2022.png",
  },
  {
    title: "Artery.FE: An Implementation of the 1D Blood Flow Equations in FEniCS",
    authors: "Syver Døving Agdestein, Kristian Valen-Sendstad, and Alexandra Diem",
    venue: "Journal of Open Source Software 3.32",
    year: 2018,
    date: "2018-12",
    badges: [
      { label: "paper", url: "https://doi.org/10.21105/joss.01107", emphasized: true },
      { label: "code", url: "https://github.com/KVSlab/bloodflow" },
    ],
  },
]
