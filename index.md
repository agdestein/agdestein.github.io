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
      text: About
      link: /about
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

<script setup>
import { data as posts } from '/data/posts.data'
import formatDate from '/.vitepress/theme/utils/formatDate';
import getSorted from '/.vitepress/theme/utils/getSorted';
const sortedPosts = getSorted( posts );
</script>

## Recent blog posts

<ul>
    <li v-for="post of sortedPosts">
        <strong><a :href="post.url">{{ post.frontmatter.title }}</a></strong><br/>
        <span>{{ formatDate( post.frontmatter.date ) }}</span>
    </li>
</ul>

<style scoped>
ul {
    list-style-type: none;
    padding-left: 0;
    font-size: 1.125rem;
    line-height: 1.75;
}

li {
    display: flex;
    justify-content: space-between;
}

li span {
    font-family: var(--vp-font-family-mono);
    font-size: var(--vp-code-font-size);
}
</style>
