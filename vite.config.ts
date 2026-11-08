import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => ({
  // Base relativa en producción: el sitio funciona en cualquier subruta
  // (GitHub Pages /yellow-mask/, Vercel, Netlify…). El router usa hash.
  base: command === 'build' ? './' : '/',
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
}));
