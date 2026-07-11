import type { Badge } from './publications'
import type { WorkId } from './works'

export interface Talk {
  title: string
  venue: string
  location: string
  date: string
  // Shared work id (see data/works.ts) for the thumbnail; `image` overrides.
  work?: WorkId
  image?: string
  slidesUrl?: string
  abstractUrl?: string
  webpageUrl?: string
  // Extra cross-reference badges (paper, blog post, code, ...), rendered
  // after the slides/abstract/webpage badges.
  badges?: Badge[]
}

export const talks: Talk[] = [
  {
    title: "Approaching the optimal closure: Equivariance, inductive bias, and Reynolds-number generalization in data-driven LES",
    venue: "WCCM–ECCOMAS",
    location: "Munich, Germany",
    date: "July 22, 2026",
    work: "symmetry",
    // Interactive HTML deck (self-contained single file); the PDF badge is a static fallback.
    slidesUrl: "/slides/20260722-ECCOMAS.html",
    webpageUrl: "https://wccm-eccomas2026.org/",
    abstractUrl: "https://wccm-eccomas2026.org/event/contribution/8fa4db60-f2c8-11f0-9f27-000c29ddfc0c",
    badges: [
      { label: "pdf", url: "/slides/20260722-ECCOMAS.pdf" },
      { label: "preprint", url: "https://doi.org/10.48550/arXiv.2603.05325" },
      { label: "blog post", url: "/posts/2026-07-06-symmetry" },
    ],
  },
  {
    title: "Data-driven discrete closure models for large-eddy simulation of incompressible turbulence",
    venue: "Bernoulli Institute Seminar",
    location: "Groningen, the Netherlands",
    date: "July 2, 2026",
    work: "thesis",
    slidesUrl: "/slides/20260702-Bernoulli.pdf",
    badges: [
      { label: "thesis", url: "https://research.tue.nl/en/publications/data-driven-discrete-closure-models-for-large-eddy-simulation-of-/" },
    ],
  },
  {
    title: "Are we modeling the wrong stress tensor in LES?",
    venue: "ERCOFTAC DLES",
    location: "Delft, the Netherlands",
    date: "May 21, 2026",
    work: "exactClosure",
    slidesUrl: "/slides/20260521-DLES.pdf",
    webpageUrl: "https://dles.ercoftac.org/dles15/",
    badges: [
      { label: "paper", url: "https://doi.org/10.1016/j.jcp.2026.114810" },
      { label: "blog post", url: "/posts/2026-07-04-exact-closure" },
    ],
  },
  {
    title: "Data-driven discrete closure models for large-eddy simulation of incompressible turbulence",
    venue: "KWG afternoon session",
    location: "Amsterdam, the Netherlands",
    date: "May 8, 2026",
    work: "thesis",
    slidesUrl: "/slides/20260508-KWG.pdf",
    webpageUrl: "https://kwg.nl/en/kwg-event/kwg-middag/",
    badges: [
      { label: "thesis", url: "https://research.tue.nl/en/publications/data-driven-discrete-closure-models-for-large-eddy-simulation-of-/" },
    ],
  },
  {
    title: "Symmetry-preserving LES: Comparison of data-driven closure models",
    venue: "ERCOFTAC ML4FLUIDS",
    location: "Amsterdam, the Netherlands",
    date: "March 2026",
    work: "symmetry",
    slidesUrl: "/slides/20260304-ML4FLUIDS.pdf",
    webpageUrl: "https://ml4fluids2026.github.io/",
    badges: [
      { label: "preprint", url: "https://doi.org/10.48550/arXiv.2603.05325" },
    ],
  },
  {
    title: "Data-driven closure modeling: From deterministic to probabilistic models",
    venue: "INRIA SPADES associate team meeting",
    location: "Rome, Italy",
    date: "December 2025",
    slidesUrl: "/slides/20251216-SPADES.pdf",
  },
  {
    title: "Should structural turbulence closures be non-symmetric?",
    venue: "SCS Spring Meeting",
    location: "Hasselt, Belgium",
    date: "June 2025",
    work: "exactClosure",
    webpageUrl: "https://wsc.project.cwi.nl/spring-symposium/2025-meeting/2025-meeting",
    badges: [
      { label: "paper", url: "https://doi.org/10.1016/j.jcp.2026.114810" },
      { label: "blog post", url: "/posts/2026-07-04-exact-closure" },
    ],
  },
  {
    title: "Model-data consistent closure models in large-eddy simulation",
    venue: "SIAM CSE",
    location: "Fort Worth, USA",
    date: "February 2025",
    abstractUrl: "https://meetings.siam.org/sess/dsp_talk.cfm?p=143335",
    webpageUrl: "https://www.siam.org/conferences-events/past-event-archive/cse25/",
  },
  {
    title: "Model-data consistent closure models in large-eddy simulation",
    venue: "DTE & AICOMAS",
    location: "Paris, France",
    date: "February 2025",
  },
  {
    title: "Discrete closure models for turbulent flows: Exploiting differentiable programming",
    venue: "Meetup of the NL-RSE Community",
    location: "Amsterdam, the Netherlands",
    date: "November 2024",
    work: "suite",
    badges: [
      { label: "code", url: "https://github.com/agdestein/IncompressibleNavierStokes.jl" },
      { label: "blog post", url: "/posts/2024-10-06-differentiable-fluid-solver" },
    ],
  },
  {
    title: "Discretize first, filter next: Learning divergence-consistent closure models for large-eddy simulation",
    venue: "ECCOMAS",
    location: "Lisbon, Portugal",
    date: "June 2024",
    work: "divConsistency",
    badges: [
      { label: "paper", url: "https://doi.org/10.1016/j.jcp.2024.113577" },
    ],
  },
  {
    title: "Learning neural closure models for discretely filtered turbulence",
    venue: "ERCOFTAC ML4FLUIDS",
    location: "Paris, France",
    date: "March 2024",
  },
  {
    title: "Closure models for discretely filtered differential equations",
    venue: "CFC",
    location: "Cannes, France",
    date: "April 2023",
  },
  {
    title: "Closure models for discretely filtered differential equations",
    venue: "Seminar, Bernoulli Institute for Mathematics, Groningen University",
    location: "Groningen, the Netherlands",
    date: "February 2023",
  },
  {
    title: "Closure models for discretely filtered differential equations",
    venue: "SIAM CSE",
    location: "Amsterdam, the Netherlands",
    date: "February 2023",
  },
  {
    title: "Data-driven filtering of differential equations",
    venue: "ECCOMAS",
    location: "Oslo, Norway",
    date: "June 2022",
    work: "eccomas2022",
    badges: [
      { label: "paper", url: "https://doi.org/10.23967/eccomas.2022.094" },
    ],
  },
]
