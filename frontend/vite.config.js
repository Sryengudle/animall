import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// In dev we serve at /, in production we serve under /Animall/ (GitHub Pages).
// React Router reads import.meta.env.BASE_URL to stay in sync.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Animall/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Dev mode service worker (handy for testing offline)
      devOptions: { enabled: false },
      manifest: {
        name: 'जनावर बाजार - Animall',
        short_name: 'Animall',
        description: 'गावाचा विश्वासू प्राणी बाजार | Village Animal Marketplace',
        theme_color: '#16a34a',
        background_color: '#f0fdf4',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // Cache all static assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Cache API animal listings (stale-while-revalidate for freshness + speed)
            urlPattern: /\/api\/animals/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'animall-api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache uploaded animal images
            urlPattern: /\/uploads\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'animall-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      // Python (FastAPI) backend on 5001. macOS AirPlay receiver squats on 5000,
      // so the Python backend lives on 5001 by default. If you re-enable the Node
      // backend on 5000, switch these two lines back.
      '/api': 'http://localhost:5001',
      '/uploads': 'http://localhost:5001',
    },
    allowedHosts: ['my-unique-demo-123.loca.lt']
  },
}));
