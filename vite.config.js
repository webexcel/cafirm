import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    chunkSizeWarningLimit: 60000,
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://caf.webexcel.in',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: path => path.replace(/^\/api/, '')
  //     }
  //   }
  // }
});
