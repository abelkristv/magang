import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [
    react(),
    {
      name: "restrict-access",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.headers.referer && req.headers.referer.includes('http://localhost')) {
            return next();
          }

          if (req.url && req.url.match(/\.(jpeg|png)$/)) { 
            res.writeHead(403, { "Content-Type": "text/html" });
            res.end(`<h1>403 Forbidden</h1><p>Direct image access is blocked.</p>`);
            return;
          }
          next();
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
  },
  server: {
    hmr: {
      overlay: false
    },
    fs: {
      strict: true
    }
  },
  css: {
    postcss: './postcss.config.cjs',
  },
});
