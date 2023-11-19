import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@packages': fileURLToPath(new URL('./packages', import.meta.url))
    }
  },
  build: {
    copyPublicDir: false,
    outDir: './dist/service-worker',
    lib: {
      entry: resolve(__dirname, 'src-service-worker/index.ts'),
      formats: ['es'],
      name: 'GlovoWebFavorites',
      fileName: 'index',
    },
  },
})


