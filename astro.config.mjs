import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeHighlight from 'rehype-highlight';

export default defineConfig({
  site: 'https://urandom.io',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [[rehypeHighlight, { detect: true }]],
  },
  compressHTML: true,
});
