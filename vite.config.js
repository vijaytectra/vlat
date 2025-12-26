import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    port: 5173,
    // Note: Headers are set via middleware plugin below
  },
  build: {
    rollupOptions: {
      output: {
        // Add content hash to filenames for cache busting
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
      },
    },
    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    cssCodeSplit: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  plugins: [
    // Add cache headers middleware for dev server
    {
      name: "cache-headers",
      configureServer(server) {
        // Must be early in the middleware chain
        server.middlewares.use((req, res, next) => {
          const url = req.url || "";

          // Skip if already processed or is API route
          if (url.startsWith("/api/") || url.startsWith("/node_modules/")) {
            return next();
          }

          // Images - 1 year cache (immutable)
          if (url.match(/\.(svg|png|jpg|jpeg|webp|gif|ico)$/i)) {
            res.setHeader(
              "Cache-Control",
              "public, max-age=31536000, immutable"
            );
            res.setHeader("X-Content-Type-Options", "nosniff");
          }
          // CSS - 1 year cache (immutable)
          else if (url.match(/\.css(\?.*)?$/i)) {
            res.setHeader(
              "Cache-Control",
              "public, max-age=31536000, immutable"
            );
            res.setHeader("Content-Type", "text/css; charset=utf-8");
          }
          // JavaScript - 1 year cache (immutable)
          else if (url.match(/\.js(\?.*)?$/i)) {
            res.setHeader(
              "Cache-Control",
              "public, max-age=31536000, immutable"
            );
            res.setHeader(
              "Content-Type",
              "application/javascript; charset=utf-8"
            );
          }
          // HTML - 1 hour cache (must revalidate)
          else if (
            url.match(/\.(html|htm)$/i) ||
            url === "/" ||
            !url.includes(".")
          ) {
            res.setHeader(
              "Cache-Control",
              "public, max-age=3600, must-revalidate"
            );
          }

          next();
        });
      },
    },
  ],
});
