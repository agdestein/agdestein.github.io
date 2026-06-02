---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Syver Døving Agdestein"
  tagline: PhD candidate in applied mathematics · closure models · turbulence · differentiable programming
  image:
    src: /logo.png
    alt: Syver Døving Agdestein
  actions:
    - theme: brand
      text: GitHub
      link: https://github.com/agdestein
    - theme: alt
      text: CV
      link: /about

features:
  - title: PhD project
    details:
        I am currently working on a PhD on discrete closure models for turbulent fluid
        flows at CWI in Amsterdam, the Netherlands.
  - title: Software
    details:
        I enjoy developing software for scientific computing using Julia,
        differentiable programming, and GPUs.
  - title: Other interests
    details: History, languages, bouldering, piano sonatas.
---

## Recent publications

<PublicationList :limit="2" />

## Recent talks

<TalkList :limit="2" />

## Recent blog posts

<PostList :limit="2" />
