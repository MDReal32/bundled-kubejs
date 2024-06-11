import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    outDir: "build",
    ssr: true,
    lib: {
      name: "KubeJS/Plugin",
      entry: { main: "src/main.ts", cli: "src/cli.ts" },
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
