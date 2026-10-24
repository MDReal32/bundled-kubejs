import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

import { mcVariants } from "../src/variants/const";
import type { McLine } from "../src/variants/mc-variant";
import { assertLatestMcLinePointers } from "./assert-latest-mc-line-pointers";
import { assertLinePackages } from "./assert-line-packages";
import { externalDependencies, libraryOptions } from "./const";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));

export const createLineViteConfig = (line: McLine) => {
  const lines = Object.keys(mcVariants);

  assertLatestMcLinePointers(packageRoot, lines);
  assertLinePackages(packageRoot, lines);

  return defineConfig({
    root: packageRoot,
    plugins: [dts({ rollupTypes: true }), tsconfigPaths()],
    define: {
      __DEV__: process.env.NODE_ENV === "development",
      __MC_LINE__: JSON.stringify(line)
    },
    build: {
      outDir: resolve(packageRoot, "npm", `mc-${line}`, "build"),
      emptyOutDir: true,
      ssr: true,
      lib: libraryOptions,
      rollupOptions: { external: externalDependencies },
      sourcemap: true
    }
  });
};
