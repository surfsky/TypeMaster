import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'public',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && (assetInfo.name.endsWith('.mp3') || assetInfo.name.endsWith('.wav')) ) {
            return 'assets/sounds/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Type Master',
        short_name: 'Typer',
        start_url: './',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#3b82f6',
        description: 'TypeScript + Vite 的打字学习应用',
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/sounds/*',
          dest: 'assets/sounds'
        }
      ]
    })
  ],
})
