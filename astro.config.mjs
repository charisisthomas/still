import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://still-studio.example.com',
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});