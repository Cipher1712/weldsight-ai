import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],

  ssr: {
    noExternal: [
      "@tanstack/react-start",
      "@tanstack/start",
    ],
  },

  optimizeDeps: {
    exclude: [
      "@tanstack/start-storage-context",
    ],
  },

  build: {
    rollupOptions: {
      external: [
        "node:async_hooks",
        "@tanstack/start-storage-context",
      ],
    },
  },
});
