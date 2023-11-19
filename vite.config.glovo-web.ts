import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  resolve: {
    alias: {
      '@packages': fileURLToPath(new URL('./packages', import.meta.url))
    }
  },
  build: {
    copyPublicDir: false,
    outDir: './dist/glovo-web',
    lib: {
      entry: resolve(__dirname, 'src-glovo-web/index.ts'),
      formats: ['es'],
      name: 'GlovoWebFavorites',
      fileName: 'index',
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src-glovo-web/css/styles.css',
          dest: './'
        },
        {
          src: 'public/heart_red.png',
          dest: './'
        },
      ],
    }),
  ],
})


