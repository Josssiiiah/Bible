import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default {
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API requests to the Mastra server
      "/api": {
        target: "http://localhost:4111",
        changeOrigin: true,
      },
    },
  },
};
