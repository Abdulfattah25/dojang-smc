import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png', 'logo-satria-muda.png'],
      manifest: {
        name: 'Taekwondo Satria Muda Club',
        short_name: 'TKD SMC',
        description: 'Sistem Registrasi & Manajemen Anggota Taekwondo Satria Muda Club',
        theme_color: '#161311',
        background_color: '#161311',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/admin/login',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Dashboard Admin',
            short_name: 'Dashboard',
            description: 'Buka Dashboard Utama Admin',
            url: '/admin/dashboard',
            icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Calon Pendaftar',
            short_name: 'Pendaftar',
            description: 'Lihat Pendaftar Baru',
            url: '/admin/applicants',
            icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Form Pendaftaran Publik',
            short_name: 'Formulir',
            description: 'Buka Form Registrasi Anggota Baru',
            url: '/',
            icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            if (res && res.writeHead && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                error: 'Backend Cloudflare Functions (port 8788) belum aktif. Jalankan "npm run dev:all" atau "npm run pages:dev" di terminal.'
              }));
            }
          });
        }
      }
    }
  }
});
