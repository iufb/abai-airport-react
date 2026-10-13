import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
const airportApi = {
  "/api": {
    target: "https://abaiairport.kz",
    changeOrigin: true,
  },
};

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { proxy: airportApi },
  preview: { proxy: airportApi },
});
