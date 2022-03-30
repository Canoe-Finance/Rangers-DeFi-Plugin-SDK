import path from 'path'
import litcss from 'rollup-plugin-postcss-lit'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es']
    },
    rollupOptions: {
      // external: /^lit-element/
    }
  },
  plugins: [
    {
      ...litcss(),
      enforce: 'post'
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
