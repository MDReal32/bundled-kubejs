import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const external = [
  /^node:/,
  /^fs(\/promises)?$/,
  "path",
  "util",
  "events",
  "stream",
  "assert",
  "buffer",
  "crypto",
  /^https?$/,
  "os",
  "querystring",
  "string_decoder",
  "tty",
  "url",
  "zlib",
  "tls",
  "module",
  "net",
  "child_process",
  "worker_threads",
  "fsevents"
];

export default defineConfig({
  build: {
    outDir: "build",
    lib: {
      name: "KubeJS/Plugin",
      entry: { main: "src/main.ts" },
      fileName: "main",
      formats: ["es"]
    },
    rollupOptions: {
      output: {
        chunkFileNames: "[name].js",
        assetFileNames: "[name][extname]"
      },

      external
    }
  },
  plugins: [dts()]
});
