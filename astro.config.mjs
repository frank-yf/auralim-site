import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://frank-yf.github.io',
  base: process.env.SITE_BASE || '/',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
