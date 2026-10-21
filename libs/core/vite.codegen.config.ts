import { defineConfig } from "vite";

import { cfServerAlias, cfServerBridge } from "./vite/cf-server-bridge";

export default defineConfig({
  resolve: { alias: cfServerAlias },
  plugins: [cfServerBridge()],
  build: {
    ssr: true,
    write: false,
    lib: { entry: "src/api/cf-server-client.ts", formats: ["es"] }
  }
});
