export interface Publication {
  title: string
  authors: string
  venue: string
  year: number
  doi?: string
  preprintDoi?: string
  codeUrl?: string
  image?: string
}

export const publications: Publication[] = [
  {
    title: "Comparison of Data-Driven Symmetry-Preserving Closure Models for Large-Eddy Simulation",
    authors: "Syver Døving Agdestein and Benjamin Sanderse",
    venue: "arXiv preprint",
    year: 2026,
    preprintDoi: "10.48550/arXiv.2603.05325",
    codeUrl: "https://github.com/agdestein/SymmetryCode.jl",
    image: "agdesteinComparisonDatadrivenSymmetrypreserving2026.png",
  },
  {
    title: "Exact Expressions for the Unresolved Stress in a Finite-Volume Based Large-Eddy Simulation",
    authors: "Syver Døving Agdestein, Roel Verstappen, and Benjamin Sanderse",
    venue: "Journal of Computational Physics 556",
    year: 2026,
    doi: "10.1016/j.jcp.2026.114810",
    preprintDoi: "10.48550/arXiv.2507.17051",
    codeUrl: "https://github.com/agdestein/ExactClosure.jl",
    image: "agdesteinExactExpressionsUnresolved2026.svg",
  },
  {
    title: "A New Data-Driven Energy-Stable Evolve-Filter-Relax Model for Turbulent Flow Simulation",
    authors: "Anna Ivagnes et al.",
    venue: "Computer Methods in Applied Mechanics and Engineering 450",
    year: 2026,
    doi: "10.1016/j.cma.2025.118654",
    preprintDoi: "10.48550/arXiv.2507.17423",
    image: "ivagnesNewDatadrivenEnergystable2026.png",
  },
  {
    title: "Discretize First, Filter next: Learning Divergence-Consistent Closure Models for Large-Eddy Simulation",
    authors: "Syver Døving Agdestein and Benjamin Sanderse",
    venue: "Journal of Computational Physics 522",
    year: 2025,
    doi: "10.1016/j.jcp.2024.113577",
    preprintDoi: "10.48550/arXiv.2403.18088",
    codeUrl: "https://github.com/agdestein/DivergenceConsistency",
    image: "agdesteinDiscretizeFirstFilter2025.svg",
  },
  {
    title: "Discretize First, Filter next – a New Closure Model Approach",
    authors: "Syver Døving Agdestein and Benjamin Sanderse",
    venue: "8th European Congress on Computational Methods in Applied Sciences and Engineering (ECCOMAS)",
    year: 2022,
    doi: "10.23967/eccomas.2022.094",
    preprintDoi: "10.48550/arXiv.2208.09363",
    codeUrl: "https://github.com/agdestein/DiscreteFiltering.jl",
    image: "agdesteinDiscretizeFirstFilter2022.png",
  },
  {
    title: "Practical Computation of the Diffusion MRI Signal Based on Laplace Eigenfunctions: Permeable Interfaces",
    authors: "Syver Døving Agdestein, Try Nguyen Tran, and Jing-Rebecca Li",
    venue: "NMR in Biomedicine 35.3",
    year: 2022,
    doi: "10.1002/nbm.4646",
    codeUrl: "https://github.com/SpinDoctorMRI/SpinDoctor",
    image: "agdesteinPracticalComputationDiffusion2022.png",
  },
  {
    title: "Artery.FE: An Implementation of the 1D Blood Flow Equations in FEniCS",
    authors: "Syver Døving Agdestein, Kristian Valen-Sendstad, and Alexandra Diem",
    venue: "Journal of Open Source Software 3.32",
    year: 2018,
    doi: "10.21105/joss.01107",
    codeUrl: "https://github.com/KVSlab/bloodflow",
  },
]
