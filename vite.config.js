import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow network access
    port: process.env.PORT || 5173, // use Render's assigned port
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    host: true, // allow external hosts
    port: process.env.PORT || 4173,
    strictPort: true,
    allowedHosts: [
      "perfect-match-frontend-n2kz.onrender.com" // Render frontend URL
    ],
  },
});
