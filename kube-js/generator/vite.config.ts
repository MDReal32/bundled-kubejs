import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: true,
    outDir: "build",
    lib: {
      name: "KubeJS/Generator",
      entry: { main: "src/main.ts", dialog: "src/dialog.ts", dev: "src/dev.ts" },
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
