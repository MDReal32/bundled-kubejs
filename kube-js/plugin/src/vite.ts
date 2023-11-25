import { existsSync } from "node:fs";
import { readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { merge } from "lodash";
import type { Plugin, UserConfig, UserConfigExport } from "vite";

import { __dirname } from "./const";

const defineConfigUsed = Symbol("defineConfigUsed");

export default function vitePlugin(): Plugin {
  return {
    name: "kubejs:vite-plugin",
    enforce: "pre",

    async config() {
      const modsDir = resolve(process.cwd(), "mods");
      if (!existsSync(modsDir))
        throw new Error(`Please setup project on root directory of minecraft forge project.`);

      if (!vitePlugin[defineConfigUsed]) {
        console.warn(
          `Please use \`defineViteConfig\` function exported from "@kubejs/plugin" to define vite config, otherwise you will experience some issues when try to build.`
        );
      }
    },

    async buildStart() {
      const probeGeneratedDir = resolve(process.cwd(), "kubejs/probe/generated");

      const files = existsSync(probeGeneratedDir) ? await readdir(probeGeneratedDir) : [];
      if (files.length === 0)
        return console.warn(
          `Please install ProbeJS and run \`/probejs dump\` in-game to generate probe files.`
        );

      const generatedScripts = files.map(file => resolve(probeGeneratedDir, file));
      const tsGeneratedFile = generatedScripts
        .map(file => `/// <reference path="${file}" />\n`)
        .join("");

      await writeFile(resolve(__dirname, "../probe.d.ts"), tsGeneratedFile);
    }
  };
}
vitePlugin[defineConfigUsed] = false;

const resolveOrDefault = (name: string, root: string) =>
  existsSync(resolve(root, `${name}.ts`))
    ? resolve(root, `${name}.ts`)
    : resolve(__dirname, `../entry/${name}.ts`);
export const defineConfig = async (config?: UserConfigExport) => {
  const userDefinedConfig =
    (await (typeof config === "function"
      ? config({ command: "build", isPreview: false, isSsrBuild: false, mode: "development" })
      : config)) || {};
  vitePlugin[defineConfigUsed] = true;

  return merge<UserConfig, UserConfig>(userDefinedConfig, {
    plugins: [vitePlugin()],
    build: {
      outDir: resolve(process.cwd(), "kubejs"),
      emptyOutDir: false,
      lib: {
        name: "kubejs",
        entry: {
          client: resolveOrDefault("client", resolve(process.cwd(), "src")),
          server: resolveOrDefault("server", resolve(process.cwd(), "src")),
          startup: resolveOrDefault("startup", resolve(process.cwd(), "src"))
        },
        formats: ["es"],
        fileName(_, entry) {
          return `${entry}_scripts/script.js`;
        }
      },
      minify: "esbuild"
    },
    optimizeDeps: {
      disabled: true
    }
  });
};
