import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
export default defineConfig({
  site: 'https://agdestein.github.io',
  // Match the existing GitHub Pages clean URLs and .html bookmarks.
  build: { format: 'file' },
  devToolbar: { enabled: false },
  integrations: [vue(), mdx()],
  markdown: { processor: unified({ remarkPlugins: [remarkMath, remarkGfm], rehypePlugins: [rehypeKatex] }), shikiConfig: {theme: {
    name: 'atmosphere', type: 'dark', colors: {'editor.background':'var(--surface)', 'editor.foreground':'var(--ink)'},
    settings: [
      {scope:['comment'], settings:{foreground:'var(--muted)', fontStyle:'italic'}},
      {scope:['keyword','storage'], settings:{foreground:'var(--series-2)'}},
      {scope:['string'], settings:{foreground:'var(--series-1)'}},
      {scope:['constant.numeric','constant.language'], settings:{foreground:'var(--series-3)'}},
      {scope:['entity.name.function','support.function'], settings:{foreground:'var(--series-4)'}},
      {scope:['entity.name.type','support.type'], settings:{foreground:'var(--series-5)'}},
    ],
  }} },
});
