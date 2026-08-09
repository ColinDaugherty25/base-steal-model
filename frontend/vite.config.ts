import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split large, rarely-changing vendor libraries into their own
        // chunks so they cache independently from app code and from
        // each other, instead of one large "everything shared" bundle.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined
          if (id.includes("node_modules/motion") || id.includes("node_modules/framer-motion")) {
            return "vendor-motion"
          }
          if (id.includes("node_modules/radix-ui") || id.includes("node_modules/@radix-ui")) {
            return "vendor-radix"
          }
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
            return "vendor-react"
          }
          return "vendor"
        },
      },
    },
  },
  server: {
    proxy: {
      // Forward API calls to the Go backend in dev. Defaults to :8080
      // (cmd/server/main.go's default, see internal/config) -- override
      // with BACKEND_URL if that port is taken locally.
      "/api": {
        target: process.env.BACKEND_URL || "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
})
