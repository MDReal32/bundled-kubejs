import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkgJson from "./package.json";

const external = [
  /^node:/,
  "yargs/helpers",
  "child_process",
  "readline",
  "events",
  "fs",
  "fs/promises",
  "stream",
  "util",
  "url",
  "path",
  ...Object.keys(pkgJson.dependencies || {}),
  ...Object.keys(pkgJson.devDependencies || {})
];

export default defineConfig({
  build: {
    outDir: "build",
    lib: {
      name: "KubeJS/Generator",
      entry: { main: "src/main.ts", dialog: "src/dialog.ts" },
      fileName: "[name].js",
      formats: ["es"]
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "assets/[name][extname]"
      },
      external
    },
    target: "ESNext",
    minify: false,
    sourcemap: true
  },
  plugins: [dts()]
});
