import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [dts({ rollupTypes: true }), tsconfigPaths()],
  define: { __DEV__: process.env.NODE_ENV === "development" },
  build: {
    outDir: "build",
    ssr: true,
    lib: {
      name: "KubeJS/Plugin",
      entry: { main: "src/main.ts", cli: "src/cli.ts" },
      formats: ["es"]
    },
    rollupOptions: { external: ["@kubejs/core"] },
    sourcemap: true
  }
});
