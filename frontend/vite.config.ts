import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Harus sebelum plugin React agar route code splitting otomatis berjalan.
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  optimizeDeps: {
    include: ["leaflet", "react-leaflet"],
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/notifications': 'http://localhost:3000',
      '/assignments': 'http://localhost:3000',
      '/community': 'http://localhost:3000',
      '/hotspots': 'http://localhost:3000',
      '/reports': 'http://localhost:3000',
      '/emergency': 'http://localhost:3000',
      '/moderation': 'http://localhost:3000',
      '/users': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
    },
  },
})
