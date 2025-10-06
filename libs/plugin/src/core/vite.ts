import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import * as process from "node:process";

import { watch } from "chokidar";
import _ from "lodash";
import type { Plugin, UserConfig } from "vite";

import { Logger } from "@kubejs/core";
import babel from "@rollup/plugin-babel";

import { __dirname } from "../const";
import { App } from "../types/app";
import { AppState } from "../types/app-states";
import { Args } from "../types/args";
import { Entry, entries } from "../types/entry";

export class Vite<TArgs extends Args> {
  private readonly logger = new Logger("KubeJS Plugin/Compiler");

  private readonly appStates: Record<Entry, App> = {
    client: { state: AppState.PREPARING },
    server: { state: AppState.PREPARING },
    startup: { state: AppState.PREPARING }
  };

  constructor(public args: TArgs) {}

  async resolveConfig() {
    const possibleViteConfigFiles = [
      resolve(process.cwd(), "vite.config.ts"),
      resolve(process.cwd(), "vite.config.js")
    ];
    const viteConfigFile = possibleViteConfigFiles.find(file => existsSync(file));

    if (viteConfigFile) {
      this.logger.info(`Found vite config file at ${viteConfigFile}. Compiling...`);
      let compiledConfigFileName = viteConfigFile;
      if (viteConfigFile.endsWith(".ts")) {
        const { build } = await import("vite");

        const builtFileName = `${viteConfigFile}.${Date.now()}`;
        const viteConfigUrl = this.isWindows ? `file://${viteConfigFile}` : viteConfigFile;
        await build({
          build: {
            outDir: dirname(viteConfigFile),
            ssr: true,
            lib: { entry: { [basename(builtFileName)]: viteConfigUrl }, formats: ["es"] }
          },
          logLevel: "silent"
        });
        compiledConfigFileName = `${builtFileName}.js`;
      }

      const userDefinedConfig = await import(compiledConfigFileName);
      viteConfigFile.endsWith(".ts") && (await rm(compiledConfigFileName, { force: true }));
      this.logger.info(`Successfully compiled vite config file.`);
      return userDefinedConfig.default;
    }

    return {};
  }

  async build() {
    this.logger.info("Starting to build scripts...");
    await this.prepare();
    const entryPromises = entries.map(entry => this._build(entry));
    await Promise.all(entryPromises);
    await this.patch();
  }

  async watch() {
    this.logger.info("Starting to watch scripts...");
    await this.prepare();
    await Promise.all(entries.map(entry => this.watchFile(entry)));
  }

  private async watchFile(entry: Entry) {
    const entryFile = resolve(`src/${entry}.ts`);
    const isEntryExists = existsSync(entryFile);
    const watcher = watch(entryFile, { ignoreInitial: true });
    if (!isEntryExists) {
      console.warn(`Entry file for ${entry} not found. Watching for changes...`);
      watcher.once("add", () => this.watchFile(entry));
    }

    await this._build(entry, { build: { watch: {} } });
  }

  private async prepare() {
    this.logger.info(
      "Dear kubejs developer, we are preparing the environment for you. Please wait..."
    );
    await this.programmaticallyPause();
    const modsDir = resolve(process.cwd(), "mods");
    if (!existsSync(modsDir)) {
      this.logger.error(`Please setup project on root directory of minecraft forge project.`);
      process.exit(1);
    }

    const probeGeneratedDir = resolve(process.cwd(), "kubejs/probe/generated");
    const files = existsSync(probeGeneratedDir) ? await readdir(probeGeneratedDir) : [];
    if (files.length === 0) {
      console.warn(
        `Please install ProbeJS and run \`/probejs dump\` in-game to generate probe files.`
      );
      return;
    }
    const generatedScripts = files.map(file => resolve(probeGeneratedDir, file));
    const tsGeneratedFile = generatedScripts
      .map(file => `/// <reference path="${file}" />\n`)
      .join("");

    await writeFile(resolve(__dirname, "../probe.d.ts"), tsGeneratedFile);
  }

  private async programmaticallyPause() {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async _build(entry: Entry, extraConfig?: UserConfig) {
    const app = this.appStates[entry];
    await this.programmaticallyPause();

    const entryFile = resolve(`src/${entry}.ts`);
    const outputFile = resolve(`kubejs/${entry}_scripts/script.js`);

    if (!existsSync(entryFile)) {
      await mkdir(dirname(outputFile), { recursive: true });
      await writeFile(outputFile, "");
      app.state = AppState.ENTRY_NOT_FOUND;
      this.logger.error(`Entry file for ${entry} not found.`);
      return;
    }

    app.state = AppState.RUNNING;
    this.logger.info(`Building ${entry} scripts...`);

    const baseConfig = _.merge<UserConfig, UserConfig, UserConfig>(
      {
        build: {
          emptyOutDir: false,
          outDir: resolve(process.cwd(), "kubejs"),
          lib: {
            name: `kubejs-scripts:${entry}`,
            fileName(_, entry) {
              return `${entry}_scripts/script.js`;
            },
            entry: entryFile,
            formats: ["es"]
          },
          minify: "esbuild",
          target: "es2018",
          chunkSizeWarningLimit: Infinity,
          rollupOptions: {
            plugins: [
              babel({
                extensions: [".js", ".ts"],
                babelHelpers: "bundled",
                presets: [["@babel/preset-env", { targets: { browsers: ["ie >= 11"] } }]]
              }),
              this.vitePluginTransformation(entry)
            ]
          }
        },
        logLevel: "silent"
      },
      extraConfig || {},
      await this.resolveConfig()
    );

    try {
      const { build } = await import("vite");
      await build(baseConfig);
    } catch (e) {
      this.appStates[entry].state = AppState.FAILED;
      this.logger.error(`Failed to build ${entry} scripts.`, e);
      return;
    }
  }

  async patch() {
    const promises = entries.map(async entry => {
      // Load the file and split the lines
      const file = `kubejs/${entry}_scripts/script.js`;

      const content = await readFile(file, "utf-8");
      const lines = content.split("\n");

      // Injected Script
      /*
         function l() {
            try {
              var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
              }));
            } catch (t) {
            }
            return (l = function() {
              return !!e;
            })();
          }
       */

      // Locate !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      const problemIndex = lines.findIndex(line =>
        line.includes("valueOf.call(Reflect.construct(Boolean, [], function() {")
      );

      // If not found, skip
      if (problemIndex === -1) return;
      const fnStart = problemIndex - 1;

      // We know that we are not in a reflective environment, so we patch the function to simply return false
      lines.splice(fnStart, 8, "return false;");

      // Write the file
      await writeFile(file, lines.join("\n"));
    });

    await Promise.all(promises);
  }

  private vitePluginTransformation(entry: Entry): Plugin {
    const appState = this.appStates[entry];
    const self = this;
    const transformedModules = new Set<string>();

    return {
      name: "kubejs:transform",

      async transform(_code, id) {
        await self.programmaticallyPause();
        transformedModules.add(id);
      },

      renderChunk() {
        appState.state = AppState.SUCCEEDED;
        self.logger.info(
          `Successfully built ${entry} scripts. Transformed ${transformedModules.size} modules.`
        );
      },

      async watchChange(_file, { event }) {
        if (event === "delete") {
          appState.state = AppState.ENTRY_NOT_FOUND;
          self.logger.error(`Entry file for ${entry} not found.`);
          await self.watchFile(entry);
          return;
        }
        if (event === "create") return;

        transformedModules.clear();
        appState.state = AppState.RUNNING;
        self.logger.info(`Rebuilding ${entry} scripts...`);
      }
    };
  }

  private get isWindows() {
    // it will return 'win32' even on win64 systems
    return process.platform === "win32";
  }
}
