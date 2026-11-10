// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://syednafizreja.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.includes('/og/') && !page.includes('/404') }),
  ],
  image: { responsiveStyles: false },
  devToolbar: { enabled: false },
});
