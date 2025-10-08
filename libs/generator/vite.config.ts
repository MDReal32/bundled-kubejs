import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    ssr: true,
    outDir: "build",
    lib: { name: "KubeJS/Generator", entry: { main: "src/main.ts" }, formats: ["es"] },
    rollupOptions: { external: ["@kubejs/core"] },
    target: "ESNext",
    minify: false,
    sourcemap: true
  }
});
