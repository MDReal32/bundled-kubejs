import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkgJson from "./package.json";

const external = [
  /^node:/,
  "fs",
  "path",
  "yargs/helpers",
  ...Object.keys(pkgJson.dependencies || {}),
  ...Object.keys(pkgJson.devDependencies || {})
];

export default defineConfig({
  build: {
    outDir: "build",
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
      external
    },
    sourcemap: true
  },
  plugins: [dts({})]
});
