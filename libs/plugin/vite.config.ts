import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [dts({ rollupTypes: true }), tsconfigPaths()],
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
      },
      external: ["@kubejs/core"]
    },
    sourcemap: true
  }
});
