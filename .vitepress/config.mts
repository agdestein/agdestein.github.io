import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Syver Døving Agdestein",
  description: "Personal website",
  markdown: {
    math: true,
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      "light": "/logo.png",
      "dark": "/logo.png"
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "About", link: "/about" },
      { text: "Blog posts", link: "/posts", activeMatch: "/posts/.*" },
    ],

    sidebar: {
      "/posts/": {
        items: [
          { text: "Overview", link: "/posts/" },
          { text: "Writing a differentiable fluid solver in Julia", link: "/posts/2024-10-06" },
          { text: "What is the difference between forward and reverse mode automatic differentiation?", link: "/posts/2024-10-05" },
        ],
      },
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/agdestein" },
      { icon: "linkedin", link: "https://www.linkedin.com/in/sdagdestein" },
      {
        icon: { svg: '<img src="researchgate.svg" width="20" height="20"/>' },
        link: "https://www.researchgate.net/profile/Syver-Agdestein",
      }, 
      {
        icon: { svg: '<img src="orcid.svg" width="20" height="20"/>' },
        link: "https://orcid.org/0000-0002-1589-2916",
      }, 
    ],
  },
})
