// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

const SITE_URL = 'https://elrincondehector.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [icon(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true,
      }
    }
  },
});