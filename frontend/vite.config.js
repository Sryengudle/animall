import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In dev we serve at /, in production we serve under /Pashubazar/ (GitHub Pages).
// React Router reads import.meta.env.BASE_URL to stay in sync.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Pashubazar/' : '/',
  resolve: {
    alias: {
      // `@/` always resolves to /src. Keeps deep imports readable:
      //   import Button from '@/components/ui/Button'
      // instead of:
      //   import Button from '../../../components/ui/Button'
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Dev mode service worker (handy for testing offline)
      devOptions: { enabled: false },
      manifest: {
        name: 'जनावर बाजार - Pashubazar',
        short_name: 'Pashubazar',
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
        importScripts: ['/custom-worker.js'],
        // Cache all static assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // 🔥 ADD THIS CONFIG LAYER:
        // This stops the PWA Service Worker from intercepting API calls
        // navigateFallbackDenylist: [/^\/api/], 

        runtimeCaching: [
          {
            // Cache API animal listings (stale-while-revalidate for freshness + speed)
            urlPattern: /\/api\/animals/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'pashubazar-api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache uploaded animal images
            urlPattern: /\/uploads\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pashubazar-images',
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
      // Canonical API is the Node backend on port 5002. AirPlay holds 5000 on
      // macOS, so we shift one slot. Python /backend-py is shelved at 5001 if
      // you spin it up — point /api there to switch.
      '/api': 'http://localhost:5002',
      '/uploads': 'http://localhost:5002',
    },
    allowedHosts: ['my-unique-demo-123.loca.lt']
  },
}));
