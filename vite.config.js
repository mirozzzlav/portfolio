import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { replaceSeoTags } from "./src/seoTags.js";

function normalizeRoute(pathname) {
  return pathname === "/index.html" ? "/" : pathname;
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "portfolio-seo",
      transformIndexHtml(html, context) {
        return replaceSeoTags(html, normalizeRoute(context.path || "/"));
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
