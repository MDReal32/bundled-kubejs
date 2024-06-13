import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    outDir: "build",
    ssr: true,
    lib: {
      name: "KubeJS/Core",
      entry: { core: "src/main.ts", dialog: "src/dialog.ts" },
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
    sourcemap: true
  },
  plugins: [dts({})]
});
