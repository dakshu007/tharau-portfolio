import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://dakshu007.github.io/tharau-portfolio/
export default defineConfig({
  site: 'https://dakshu007.github.io',
  base: '/tharau-portfolio',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  devToolbar: { enabled: false },
});
