---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Syver Døving Agdestein"
  text: "Personal website"
  tagline: PhD student in applied mathematics
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
    - theme: alt
      text: Publications
      link: /publications
    - theme: alt
      text: Talks
      link: /talks
    - theme: alt
      text: Blog posts
      link: /posts/

features:
  - title: PhD project 📖
    details:
        I am currently working on a PhD on discrete closure models for turbulent fluid
        flows at CWI in Amsterdam, the Netherlands.
  - title: Software 💻
    details:
        I enjoy developing software for scientific computing using Julia,
        differentiable programming, and GPUs.
  - title: Other interests 🎨
    details: History, languages, bouldering, piano sonatas.
---

## Recent publications

<PublicationList :limit="2" />

## Recent talks

<TalkList :limit="2" />

## Recent blog posts

<PostList :limit="2" />
