import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [dts({ rollupTypes: true }), tsconfigPaths()],
  build: {
    outDir: "build",
    ssr: true,
    emptyOutDir: true,
    lib: {
      name: "KubeJS/Core",
      entry: { main: "src/main.ts", dialog: "src/dialog.ts" },
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
  }
});
