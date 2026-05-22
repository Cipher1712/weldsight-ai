import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
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
