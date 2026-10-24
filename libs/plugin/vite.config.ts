import type { EnvironmentOptions } from "vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

import { mcVariants } from "./src/variants/const";

const lib = {
  name: "KubeJS/Plugin",
  entry: { main: "src/main.ts", cli: "src/cli.ts" },
  formats: ["es"]
} as const;

const environmentNameOf = (line: string) => `mc_${line.replace(".", "_")}`;

const mcEnvironments = Object.fromEntries(
  Object.keys(mcVariants).map(line => {
    const environment: EnvironmentOptions = {
      consumer: "server",
      define: { __MC_LINE__: JSON.stringify(line) },
      build: {
        outDir: `build/mc-${line}`,
        ssr: true,
        lib,
        rollupOptions: { external: ["@kubejs/core"] },
        sourcemap: true
      }
    };
    return [environmentNameOf(line), environment];
  })
);

export default defineConfig({
  plugins: [dts({ rollupTypes: true }), tsconfigPaths()],
  define: { __DEV__: process.env.NODE_ENV === "development" },
  environments: mcEnvironments,
  builder: {
    async buildApp(builder) {
      const environments = Object.entries(builder.environments)
        .filter(([name]) => name !== "client")
        .map(([, environment]) => environment);
      await Promise.all(environments.map(environment => builder.build(environment)));
    }
  },
  build: {
    outDir: "build",
    ssr: true,
    lib,
    rollupOptions: { external: ["@kubejs/core"] },
    sourcemap: true
  }
});
