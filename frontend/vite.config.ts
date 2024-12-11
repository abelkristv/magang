import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Change 'custom-output-folder' to your preferred directory
  },
  css: {
    postcss: './postcss.config.cjs', // Ensure PostCSS is used
  },
})
