import footnote from 'markdown-it-footnote'
import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Syver Døving Agdestein",
  description: "Personal website",
  markdown: {
    math: true,
    config: (md) => {
      md.use(footnote)
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      "light": "/logo.png",
      "dark": "/logo.png"
    },
    editLink: {
      pattern: 'https://github.com/agdestein/agdestein.github.io/tree/main/:path',
    },
    lastUpdated: {
      // text: 'Updated at',
      formatOptions: {
        dateStyle: 'long',
        // timeStyle: 'short',
        hour12: false, // Use 24-hour clock
      },
    },

    // footer: {
    //   message: 'Released under the MIT License.',
    //   copyright: 'Copyright © 2024-present Syver Døving Agdestein',
    // },

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


  vite: {
    // resolve: {
    //   alias: {
    //     '@': path.resolve(__dirname, '../components')
    //   }
    // },
    optimizeDeps: {
      exclude: [ 
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        'vitepress',
        '@nolebase/ui',
      ], 
    }, 
    ssr: { 
      noExternal: [ 
        // If there are other packages that need to be processed by Vite, you can add them here.
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/ui',
      ], 
    },
  },

})
