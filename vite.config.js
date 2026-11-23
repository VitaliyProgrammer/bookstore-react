import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Налаштування dev-сервера Vite.
// proxy: запити фронтенду на /api/... Vite пересилає на Spring (localhost:8080), відрізаючи /api.
// Для браузера це той самий origin (localhost:5173), тому під час розробки CORS не потрібен.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  }
});
