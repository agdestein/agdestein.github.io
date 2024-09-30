import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Syver Døving Agdestein",
  description: "Personal website",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      'light': '/logo.png',
      'dark': '/logo.png'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Blog posts', link: '/posts' },
    ],

    sidebar: [
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/agdestein' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/sdagdestein' },
      {
        icon: { svg: '<img src="researchgate.svg" width="20" height="20"/>' },
        link: 'https://www.researchgate.net/profile/Syver-Agdestein',
      }, 
      {
        icon: { svg: '<img src="orcid.svg" width="20" height="20"/>' },
        link: 'https://orcid.org/0000-0002-1589-2916',
      }, 
    ],
  },
})
