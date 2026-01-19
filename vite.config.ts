import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/wordleHelper/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      workbox: {
        // Increase cache size limit to accommodate multilingual word lists (~2.5MB)
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB
      },
      manifest: {
        name: 'Wordle Helper',
        short_name: 'WordleHelp',
        description: 'Smart word suggestions to solve Wordle puzzles',
        theme_color: '#121213',
        background_color: '#121213',
        display: 'standalone',
        scope: '/wordleHelper/',
        start_url: '/wordleHelper/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})
