import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    hmr: {
      overlay: false
    }
  },
  css: {
    postcss: './postcss.config.cjs',
  },
})
