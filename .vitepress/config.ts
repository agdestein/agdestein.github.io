import { writeFileSync } from 'node:fs'
import path from 'node:path'
import footnote from 'markdown-it-footnote'
import { createContentLoader, defineConfig, type HeadConfig } from "vitepress"
import { Feed } from 'feed'
import { works } from '../data/works'

const hostname = 'https://agdestein.github.io'
const siteTitle = 'Syver Døving Agdestein'
const siteDescription =
  'Postdoctoral researcher in scientific computing at CWI Amsterdam: ' +
  'turbulence closure models, probabilistic simulation of turbulence, and ' +
  'differentiable programming in Julia.'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: siteTitle,
  description: siteDescription,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${siteTitle} — blog`, href: '/feed.xml' }],
    ['meta', { name: 'theme-color', content: '#fcfcfa', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#0f172a', media: '(prefers-color-scheme: dark)' }],
  ],
  // GitHub Pages resolves /foo to foo.html, so extensionless URLs are safe.
  // Keeps internal links, canonical URLs, sitemap, and RSS consistent.
  cleanUrls: true,
  sitemap: {
    hostname,
    // Drop the date-only redirect stubs (posts/YYYY-MM-DD); their slugged
    // targets are already listed.
    transformItems: (items) =>
      items.filter((item) => !/^posts\/\d{4}-\d{2}-\d{2}$/.test(item.url)),
  },
  // Repo docs, not site content.
  srcExclude: ['README.md', 'PLAN.md', 'CLAUDE.md'],
  lastUpdated: true,
  markdown: {
    math: true,
    config: (md) => {
      md.use(footnote)
    },
  },

  // Canonical URL + Open Graph/Twitter cards for every page. Redirect stubs
  // (frontmatter `redirectTo`) instead get a meta refresh to the new URL.
  transformHead({ pageData }) {
    const fm = pageData.frontmatter
    if (fm.redirectTo) {
      return [
        ['meta', { 'http-equiv': 'refresh', content: `0; url=${fm.redirectTo}` }],
        ['link', { rel: 'canonical', href: hostname + fm.redirectTo }],
        ['meta', { name: 'robots', content: 'noindex' }],
      ]
    }
    const pagePath = pageData.relativePath
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '')
    const url = `${hostname}/${pagePath}`
    const title = pageData.title ? `${pageData.title} | ${siteTitle}` : siteTitle
    const description = fm.description ?? siteDescription
    // og:image: explicit post image (bare filename in public/posts/), else the
    // shared work thumbnail, else the site logo.
    let image = '/logo.png'
    if (fm.image) image = `/posts/${fm.image}`
    else if (fm.work && fm.work in works) image = works[fm.work as keyof typeof works].image
    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:site_name', content: siteTitle }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:type', content: pageData.relativePath.startsWith('posts/2') ? 'article' : 'website' }],
      ['meta', { property: 'og:image', content: hostname + image }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
    ]
    return head
  },

  // RSS feed for blog posts at /feed.xml.
  buildEnd: async (config) => {
    const feed = new Feed({
      title: `${siteTitle} — blog`,
      description: 'Blog posts on turbulence, closure models, and scientific computing in Julia.',
      id: `${hostname}/posts/`,
      link: `${hostname}/posts/`,
      language: 'en',
      favicon: `${hostname}/logo.png`,
      copyright: siteTitle,
    })
    const posts = await createContentLoader('posts/20*.md').load()
    posts
      .filter((post) => !post.frontmatter.redirectTo)
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .forEach((post) => {
        feed.addItem({
          title: post.frontmatter.title,
          id: hostname + post.url,
          link: hostname + post.url,
          description: post.frontmatter.description,
          date: new Date(post.frontmatter.date),
        })
      })
    writeFileSync(path.join(config.outDir, 'feed.xml'), feed.rss2())
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      "light": "/logo.png",
      "dark": "/logo.png"
    },
    search: {
      provider: 'local',
    },

    nav: [
      { text: "Publications", link: "/publications" },
      { text: "Talks", link: "/talks" },
      { text: "Software", link: "/software" },
      { text: "Blog", link: "/posts", activeMatch: "/posts/.*" },
      { text: "CV", link: "/about" },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/agdestein" },
      { icon: "linkedin", link: "https://www.linkedin.com/in/sdagdestein" },
      {
        icon: { svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google Scholar</title><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>' },
        link: "https://scholar.google.com/citations?user=GDQC4HIAAAAJ",
      },
      {
        icon: { svg: '<svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 32v448h448V32H0zm262.2 334.4c-6.6 3-33.2 6-50-14.2-9.2-10.6-25.3-33.3-42.2-63.6-8.9 0-14.7 0-21.4-.6v46.4c0 23.5 6 21.2 25.8 23.9v8.1c-6.9-.3-23.1-.8-35.6-.8-13.1 0-26.1.6-33.6.8v-8.1c15.5-2.9 22-1.3 22-23.9V225c0-22.6-6.4-21-22-23.9V193c25.8 1 53.1-.6 70.9-.6 31.7 0 55.9 14.4 55.9 45.6 0 21.1-16.7 42.2-39.2 47.5 13.6 24.2 30 45.6 42.2 58.9 7.2 7.8 17.2 14.7 27.2 14.7v7.3zm22.9-135c-23.3 0-32.2-15.7-32.2-32.2V167c0-12.2 8.8-30.4 34-30.4s30.4 17.9 30.4 17.9l-10.7 7.2s-5.5-12.5-19.7-12.5c-7.9 0-19.7 7.3-19.7 19.7v26.8c0 13.4 6.6 23.3 17.9 23.3 14.1 0 21.5-10.9 21.5-26.8h-17.9v-10.7h30.4c0 20.5 4.7 49.9-34 49.9zm-116.5 44.7c-9.4 0-13.6-.3-20-.8v-69.7c6.4-.6 15-.6 22.5-.6 23.3 0 37.2 12.2 37.2 34.5 0 21.9-15 36.6-39.7 36.6z"/></svg>' },
        link: "https://www.researchgate.net/profile/Syver-Agdestein",
      },
      {
        icon: { svg: '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M294.75 188.19h-45.92V342h47.47c67.62 0 83.12-51.34 83.12-76.91 0-41.64-26.54-76.9-84.67-76.9zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-80.79 360.76h-29.84v-207.5h29.84zm-14.92-231.14a19.57 19.57 0 1 1 19.57-19.57 19.64 19.64 0 0 1-19.57 19.57zM300 369h-81V161.26h80.6c76.73 0 110.44 54.83 110.44 103.85C410 318.39 368.38 369 300 369z"/></svg>' },
        link: "https://orcid.org/0000-0002-1589-2916",
      },
    ],
  },


})
