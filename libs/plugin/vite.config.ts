import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { EnvironmentOptions } from "vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

import { mcVariants } from "./src/variants/const";
import { assertLatestMcLinePointers } from "./tools/assert-latest-mc-line-pointers";
import { assertLinePackages } from "./tools/assert-line-packages";
import { externalDependencies, libraryOptions } from "./tools/const";
import { mcEnvironmentName } from "./tools/mc-environment-name";

const packageRoot = fileURLToPath(new URL(".", import.meta.url));
const mcLines = Object.keys(mcVariants);

assertLatestMcLinePointers(packageRoot, mcLines);
assertLinePackages(packageRoot, mcLines);

export default defineConfig({
  plugins: [dts({ rollupTypes: true }), tsconfigPaths()],
  define: { __DEV__: process.env.NODE_ENV === "development" },
  environments: Object.fromEntries(
    mcLines.map(line => {
      const environment: EnvironmentOptions = {
        consumer: "server",
        define: { __MC_LINE__: JSON.stringify(line) },
        build: {
          outDir: resolve(packageRoot, "npm", `mc-${line}`, "build"),
          emptyOutDir: true,
          ssr: true,
          lib: libraryOptions,
          rollupOptions: { external: externalDependencies },
          sourcemap: true
        }
      };
      return [mcEnvironmentName(line), environment];
    })
  ),
  builder: {
    async buildApp(builder) {
      const environments = Object.entries(builder.environments)
        .filter(([name]) => name.startsWith("mc_"))
        .map(([, environment]) => environment);
      await Promise.all(environments.map(environment => builder.build(environment)));
    }
  }
});
