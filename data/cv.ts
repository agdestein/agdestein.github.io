export interface TimelineItem {
  period: string
  title: string
  org?: string
  orgUrl?: string
  location?: string
  tag?: string // small highlighted badge, e.g. "cum laude"
  note?: string // secondary line, e.g. thesis title
  sub?: TimelineItem[] // nested entries (e.g. exchange during the master's)
}

export const employment: TimelineItem[] = [
  {
    period: "2025–Present",
    title: "Postdoctoral researcher",
    org: "Scientific Computing group, CWI",
    orgUrl: "https://www.cwi.nl/",
    location: "Amsterdam, the Netherlands",
  },
  {
    period: "2021–2025",
    title: "PhD researcher",
    org: "Scientific Computing group, CWI",
    orgUrl: "https://www.cwi.nl/",
    location: "Amsterdam, the Netherlands",
  },
  {
    period: "2020–2021",
    title: "Software Engineer",
    org: "INRIA / École Polytechnique",
    orgUrl: "https://www.inria.fr/",
    location: "Palaiseau, France",
    note: "6-month position",
  },
  {
    period: "2020",
    title: "Research intern",
    org: "IRT Saint Exupéry",
    orgUrl: "https://www.irt-saintexupery.com/",
    location: "Toulouse, France",
    note: "Multidisciplinary optimization · 6 months",
  },
]

export const education: TimelineItem[] = [
  {
    period: "2021–2026",
    title: "PhD in applied mathematics",
    org: "Eindhoven University of Technology",
    orgUrl: "https://www.tue.nl/en/",
    location: "the Netherlands",
    tag: "cum laude",
    note: "Thesis: Data-driven discrete closure models for large-eddy simulation of incompressible turbulence (research carried out at CWI, Amsterdam)",
  },
  {
    period: "2015–2020",
    title: "MSc / Diplôme d'Ingénieur, applied mathematics",
    org: "INSA Toulouse",
    orgUrl: "https://www.insa-toulouse.fr/",
    location: "France",
    sub: [
      {
        period: "2018–2019",
        title: "Exchange year",
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
