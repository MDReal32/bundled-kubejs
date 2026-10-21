import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

import { cfServerAlias, cfServerBridge } from "./vite/cf-server-bridge";

export default defineConfig({
  resolve: { alias: cfServerAlias },
  plugins: [cfServerBridge(), dts({ rollupTypes: true }), tsconfigPaths()],
  ssr: { noExternal: ["nestbridge", "@nestbridge/runtime"] },
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
