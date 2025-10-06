import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    ssr: true,
    outDir: "build",
    lib: {
      name: "KubeJS/Generator",
      entry: { main: "src/main.ts" },
      fileName: "[name].js",
      formats: ["es"]
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "assets/[name][extname]"
      }
    },
    target: "ESNext",
    minify: false,
    sourcemap: true
  }
});
