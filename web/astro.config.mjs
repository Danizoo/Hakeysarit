// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://hakeysarit.vercel.app',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
