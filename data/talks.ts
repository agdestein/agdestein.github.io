export interface Talk {
  title: string
  venue: string
  location: string
  date: string
  slidesUrl?: string
  abstractUrl?: string
  webpageUrl?: string
}

export const talks: Talk[] = [
  {
    title: "Symmetry-preserving LES: Comparison of data-driven closure models",
    venue: "ERCOFTAC ML4FLUIDS",
    location: "Amsterdam, the Netherlands",
    date: "March 2026",
    slidesUrl: "/slides/20260304-ML4FLUIDS.pdf",
    webpageUrl: "https://ml4fluids2026.github.io/",
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
    webpageUrl: "https://wsc.project.cwi.nl/spring-symposium/2025-meeting/2025-meeting",
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
  },
  {
    title: "Discretize first, filter next: Learning divergence-consistent closure models for large-eddy simulation",
    venue: "ECCOMAS",
    location: "Lisbon, Portugal",
    date: "June 2024",
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
  },
]
