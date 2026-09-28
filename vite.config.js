import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { replaceDocumentMetadata } from "./src/seoTags.js";

function normalizeRoute(pathname) {
  return pathname === "/index.html" ? "/" : pathname;
}

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("/react-router") || id.includes("/@remix-run/router")) {
            return "vendor-router";
          }

          if (id.includes("/react-dom/client") || id.includes("/react-dom-client.")) {
            return "vendor-react-dom-client";
          }

          if (id.includes("/react-dom")) {
            return "vendor-react-dom-core";
          }

          if (id.includes("/react")) {
            return "vendor-react";
          }

          if (id.includes("/@emotion")) {
            return "vendor-emotion";
          }

          return "vendor";
        }
      }
    }
  },
  plugins: [
    react(),
    {
      name: "portfolio-seo",
      transformIndexHtml(html, context) {
        return replaceDocumentMetadata(html, normalizeRoute(context.path || "/"));
      }
    }
  ],
  preview: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      "/api": "http://127.0.0.1:8001"
    },
    strictPort: true
  }
});
