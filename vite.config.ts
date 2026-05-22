import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],

  ssr: {
    noExternal: ["@tanstack/start"],
    external: ["node:async_hooks"],
  },

  optimizeDeps: {
    exclude: [
      "@tanstack/start-storage-context",
      "node:async_hooks",
    ],
  },
});
