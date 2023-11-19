import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '',
  plugins: [
    vue(),
  ],
  build: {
    outDir: './dist/chrome-popup',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src-extension-popup', import.meta.url)),
      '@packages': fileURLToPath(new URL('./packages', import.meta.url))
    }
  }
})
