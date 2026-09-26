export interface TimelineItem {
  period: string
  title: string
  artwork?: string // optional decorative SVG name in src/artwork
  org?: string
  orgUrl?: string
  location?: string
  tag?: string // small highlighted badge, e.g. "cum laude"
  note?: string // secondary line, e.g. thesis title
  sub?: TimelineItem[] // nested entries (e.g. exchange during the master's)
}

export const employment: TimelineItem[] = [
  {
    period: "2026–Present",
    title: "Postdoctoral researcher",
    artwork: "cwi",
    org: "Scientific Computing group, CWI",
    orgUrl: "https://www.cwi.nl/",
    location: "Amsterdam, the Netherlands",
    note: "Generative machine-learning closure models for large-eddy simulation.",
  },
  {
    period: "2021–2026",
    title: "PhD researcher",
    artwork: "cwi",
    org: "Scientific Computing group, CWI",
    orgUrl: "https://www.cwi.nl/",
    location: "Amsterdam, the Netherlands",
    note: "A mathematical framework for discretization, filtering, and structure-preserving machine learning for large-eddy simulation of incompressible turbulence.",
  },
  {
    period: "2020–2021",
    title: "Software Engineer",
    artwork: "inria-polytechnique",
    org: "INRIA / École Polytechnique",
    orgUrl: "https://www.inria.fr/",
    location: "Palaiseau, France",
    note: "Eigenfunction-based reduced-order modeling for direct simulation of diffusion MRI of brain tissue · 6 months",
  },
  {
    period: "2020",
    title: "Research intern",
    artwork: "irt-saint-exupery",
    org: "IRT Saint Exupéry",
    orgUrl: "https://www.irt-saintexupery.com/",
    location: "Toulouse, France",
    note: "Mixture-of-experts machine-learning models for multidisciplinary optimization of aircraft design · 6 months",
  },
]

export const education: TimelineItem[] = [
  {
    period: "2021–2026",
    title: "PhD in applied mathematics",
    artwork: "tue",
    org: "Eindhoven University of Technology",
    orgUrl: "https://www.tue.nl/en/",
    location: "the Netherlands",
    tag: "cum laude",
    note: "Awarded May 2026. Thesis: Data-driven discrete closure models for large-eddy simulation of incompressible turbulence (research carried out at CWI, Amsterdam)",
  },
  {
    period: "2015–2020",
    title: "Master of applied science and technology / Diplôme d'Ingénieur",
    artwork: "insa",
    org: "INSA Toulouse",
    orgUrl: "https://www.insa-toulouse.fr/",
    location: "France",
    note: "Integrated Bachelor’s and Master’s degree, specializing in mathematical modeling.",
    sub: [
      {
        period: "2018–2019",
        title: "Exchange year",
        artwork: "polytech",
        org: "Peter the Great St. Petersburg Polytechnic University",
        orgUrl: "https://english.spbstu.ru/",
        location: "Saint Petersburg, Russia",
        note: "Theoretical mechanics and applied mathematics",
      },
    ],
  },
  {
    period: "2012–2015",
    title: "Asker Upper Secondary School",
    location: "Norway",
    sub: [
      {
        period: "2013–2014",
        title: "Exchange year",
        org: "Collège Saint-Guibert",
        location: "Gembloux, Belgium",
      },
    ],
  },
]

export interface Supervision {
  year: string
  student: string
  thesis: string
  institution: string
}

export const supervision: Supervision[] = [
  {
    year: "2026",
    student: "Lucas Ronckers",
    thesis: "Probabilistic turbulence modeling with ideal large eddy simulation: Bayesian inverse filtering and flow matching",
    institution: "Eindhoven University of Technology",
  },
  {
    year: "2023",
    student: "Viviane Desgrange",
    thesis: "An inverse problem approach for closure modelling",
    institution: "University of Amsterdam",
  },
]

export interface Lecture {
  date: string
  title: string
  event: string
  venue: string
}

export const lectures: Lecture[] = [
  {
    date: "October 2023",
    title: "Learning neural closure models for fluid flows",
    event: "Autumn School on Scientific Machine Learning",
    venue: "CWI",
  },
  {
    date: "May 2022",
    title: "Learning physics from data",
    event: "Masterclass on Machine Learning for Inverse Problems: A Bayesian Perspective",
    venue: "CWI",
  },
]

// Each entry shows its short form as a large label, e.g. a journal abbreviation.
export interface Service {
  kind: string
  short: string
  name: string
  period?: string
}

export const service: Service[] = [
  { kind: "Peer review", short: "CMAME", name: "Computer Methods in Applied Mechanics and Engineering" },
  { kind: "Peer review", short: "JCP", name: "Journal of Computational Physics" },
  { kind: "Works council", short: "CWI", name: "CWI works council", period: "2023–2025" },
]

export const skills = {
  research: [
    "Numerical analysis",
    "Partial differential equations",
    "Finite-element and finite-volume methods",
    "Spectral methods",
    "Turbulence and large-eddy simulation",
    "Structure-preserving machine learning",
    "Generative modeling",
  ],
  computing: [
    "Julia",
    "Python",
    "MATLAB",
    "High-performance computing with Slurm",
    "Differentiable programming",
    "Multi-GPU kernel programming",
    "Git",
    "Continuous integration",
    "Agentic workflows",
  ],
}

// The greeting also labels an arm of the signpost in the skills illustration.
export interface Language {
  name: string
  level: "Fluent" | "Basic"
  greeting: string
  code: string // language tag, so the greeting is pronounced correctly
}

export const languages: Language[] = [
  { name: "Norwegian", level: "Fluent", greeting: "Hei", code: "no" },
  { name: "English", level: "Fluent", greeting: "Hello", code: "en" },
  { name: "French", level: "Fluent", greeting: "Bonjour", code: "fr" },
  { name: "Russian", level: "Basic", greeting: "Привет", code: "ru" },
  { name: "Dutch", level: "Basic", greeting: "Hallo", code: "nl" },
]
