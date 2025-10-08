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
      formats: ["es"]
    },
    sourcemap: true
  }
});
