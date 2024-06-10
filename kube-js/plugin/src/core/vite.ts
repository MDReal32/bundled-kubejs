import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";

import { watch } from "chokidar";
import _ from "lodash";
import type { Plugin, UserConfig } from "vite";

import babel from "@rollup/plugin-babel";

import { __dirname } from "../const";
import { App } from "../types/app";
import { AppState } from "../types/app-states";
import { Args } from "../types/args";
import { Entry, entries } from "../types/entry";
import { Logger } from "./logger";

export class Vite<TArgs extends Args> {
  private readonly logger = new Logger();

  private readonly appStates: Record<Entry, App> = {
    client: { state: AppState.PREPARING, transformedModules: 0 },
    server: { state: AppState.PREPARING, transformedModules: 0 },
    startup: { state: AppState.PREPARING, transformedModules: 0 }
  };

  constructor(public args: TArgs) {}

  async resolveConfig() {
    const possibleViteConfigFiles = [
      resolve(process.cwd(), "vite.config.ts"),
      resolve(process.cwd(), "vite.config.js")
    ];
    const viteConfigFile = possibleViteConfigFiles.find(file => existsSync(file));

    if (viteConfigFile) {
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
      return userDefinedConfig.default;
    }

    return {};
  }

  async build() {
    await this.prepare();
    const entryPromises = entries.map(entry => this._build(entry));
    await Promise.all(entryPromises);
    await this.patch();
    this.log();
    this.logger.reset();
  }

  async watch() {
    process.once("exit", () => {
      this.logger.reset();
    });

    await this.prepare();
    await Promise.all(entries.map(entry => this.watchFile(entry)));
    this.log();
  }

  private async watchFile(entry: Entry) {
    const entryFile = resolve(`src/${entry}.ts`);
    const isEntryExists = existsSync(entryFile);
    const watcher = watch(entryFile, { ignoreInitial: true });
    if (!isEntryExists) {
      console.warn(`Entry file for ${entry} not found. Watching for changes...`);
      this.log();
      watcher.once("add", () => this.watchFile(entry));
    }

    await this._build(entry, { build: { watch: { include: [entryFile] } } });
  }

  private log(state?: AppState) {
    const { client, startup: stup, server } = this.appStates;
    const message =
      state === AppState.PREPARING
        ? `Dear kubejs developer, we are preparing the environment for you. Please wait.`
        : `Dear kubejs developer, state of each environment is as follows:
  - Client: ${this.colorizeState(client.state)}; Transformed Modules: ${client.transformedModules}
  - Server: ${this.colorizeState(server.state)}; Transformed Modules: ${server.transformedModules}
  - Startup: ${this.colorizeState(stup.state)}; Transformed Modules: ${stup.transformedModules}`;

    this.logger.log(message);
  }

  private async prepare() {
    this.logger.bindConsole();
    this.log(AppState.PREPARING);
    await this.programmaticallyPause();
    const modsDir = resolve(process.cwd(), "mods");
    if (!existsSync(modsDir))
      throw new Error(`Please setup project on root directory of minecraft forge project.`);

    const probeGeneratedDir = resolve(process.cwd(), "kubejs/probe/generated");
    const files = existsSync(probeGeneratedDir) ? await readdir(probeGeneratedDir) : [];
    if (files.length === 0) {
      console.warn(
        `Please install ProbeJS and run \`/probejs dump\` in-game to generate probe files.`
      );
      this.log(AppState.PREPARING);
      return;
    }
    const generatedScripts = files.map(file => resolve(probeGeneratedDir, file));
    const tsGeneratedFile = generatedScripts
      .map(file => `/// <reference path="${file}" />\n`)
      .join("");

    await writeFile(resolve(__dirname, "../probe.d.ts"), tsGeneratedFile);
    this.log();
  }

  private async programmaticallyPause() {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async _build(entry: Entry, extraConfig?: UserConfig) {
    const app = this.appStates[entry];
    this.log();
    await this.programmaticallyPause();

    const entryFile = resolve(`src/${entry}.ts`);
    const outputFile = resolve(`kubejs/${entry}_scripts/script.js`);

    if (!existsSync(entryFile)) {
      await mkdir(dirname(outputFile), { recursive: true });
      await writeFile(outputFile, "");
      app.state = AppState.ENTRY_NOT_FOUND;
      this.log();
      return;
    }

    app.state = AppState.RUNNING;
    this.log();

    const baseConfig = _.merge<UserConfig, UserConfig>(
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
      extraConfig || {}
    );

    try {
      const { build } = await import("vite");
      await build(baseConfig);
    } catch (e) {
      this.appStates[entry].state = AppState.FAILED;
      this.log();
      return;
    }

    this.log();
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
        appState.transformedModules = transformedModules.size;
        self.log();
      },

      renderChunk() {
        appState.state = AppState.SUCCEEDED;
        self.log();
      },

      async watchChange(_file, { event }) {
        if (event === "delete") {
          appState.state = AppState.ENTRY_NOT_FOUND;
          appState.transformedModules = 0;
          self.log();
          await self.watchFile(entry);
          return;
        }
        if (event === "create") return;

        transformedModules.clear();
        appState.state = AppState.RUNNING;
        appState.transformedModules = 0;
        self.log();
      }
    };
  }

  private colorizeState(state: AppState) {
    switch (state) {
      case AppState.INITIALIZING:
      case AppState.PREPARING:
      case AppState.RUNNING:
        return `\x1b[33m${state}\x1b[0m`;

      case AppState.SUCCEEDED:
        return `\x1b[32m${state}\x1b[0m`;

      case AppState.FAILED:
      case AppState.ENTRY_NOT_FOUND:
        return `\x1b[31m${state}\x1b[0m`;

      default:
        return state;
    }
  }

  private get isWindows() {
    // it will return 'win32' even on win64 systems
    return process.platform === "win32";
  }
}
