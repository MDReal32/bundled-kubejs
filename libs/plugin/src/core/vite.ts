import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { basename, dirname, extname, relative, resolve } from "node:path";
import * as process from "node:process";

import chokidar from "chokidar";
import { glob } from "glob";
import _ from "lodash";
import { type EnvironmentOptions, type UserConfig, createBuilder } from "vite";

import { Logger } from "@kubejs/core";

import { statsPlugin } from "../plugins/stats.plugins";
import { swcPlugin } from "../plugins/swc.plugin";
import { App } from "../types/app";
import { AppState } from "../types/app-states";
import { Args } from "../types/args";
import { Entry, entries } from "../types/entry";
import { debounce } from "../utils/debounce";
import { programmaticallyPause } from "../utils/programmatically-pause";

type Entries = Record<Entry, [string, string][]>;

export class Vite<TArgs extends Args> {
  private readonly logger = new Logger("KubeJS Plugin/Compiler");
  private readonly appStates = new Map<string, App>();
  private _currentEnvName = "unknown";

  constructor(private readonly args: TArgs) {}

  private get root() {
    return this.args.root!;
  }

  private get isWindows() {
    // it will return 'win32' even on win64 systems
    return process.platform === "win32";
  }

  async build() {
    this.logger.info("Starting to build scripts...");
    await this.prepare();
    const entries = this.getEntries();

    // clean once for a fresh build
    await rm(resolve(this.root, "kubejs/client_scripts"), { recursive: true, force: true });
    await rm(resolve(this.root, "kubejs/server_scripts"), { recursive: true, force: true });
    await rm(resolve(this.root, "kubejs/startup_scripts"), { recursive: true, force: true });

    const { builder } = await this.createBuilderFor(entries, { watch: false });
    await programmaticallyPause();
    await builder.buildApp();
  }

  async watch() {
    this.logger.info("Starting to watch scripts...");
    await this.prepare();

    // Initial scan of entry graph
    let currentEntries = this.getEntries();

    // Clean once at the beginning of watch, so watch output dir doesn't get removed mid-stream
    await rm(resolve(this.root, "kubejs/client_scripts"), { recursive: true, force: true });
    await rm(resolve(this.root, "kubejs/server_scripts"), { recursive: true, force: true });
    await rm(resolve(this.root, "kubejs/startup_scripts"), { recursive: true, force: true });

    // Start builder in watch mode
    let { builder } = await this.createBuilderFor(currentEntries, { watch: true });
    await programmaticallyPause();
    await builder.buildApp();
    this.logger.info("Watch is live. Changes in files will trigger incremental rebuilds 🔁");

    // Watch for entry topology changes (new/removed files under src/**)
    const srcRoot = resolve(this.root, "src");
    const watcher = chokidar.watch(
      [`${srcRoot}/client/**/*`, `${srcRoot}/server/**/*`, `${srcRoot}/startup/**/*`],
      {
        ignoreInitial: true,
        awaitWriteFinish: { stabilityThreshold: 150, pollInterval: 50 }
      }
    );

    const refresh = debounce(async () => {
      try {
        this.logger.info("Entry graph change detected. Refreshing builder…");

        // Recompute entries map
        currentEntries = this.getEntries();

        // Recreate builder so environments reflect added/removed entrypoints
        const created = await this.createBuilderFor(currentEntries, { watch: true });
        builder = created.builder;

        // Build once to attach watchers for new envs & emit initial output
        await builder.buildApp();
        this.logger.info("Builder refreshed ✅");
      } catch (err) {
        this.logger.error("Failed to refresh builder after entry change.", err as any);
      }
    }, 200);

    watcher.on("add", refresh).on("unlink", refresh).on("addDir", refresh).on("unlinkDir", refresh);

    // Optional: keep process alive explicitly (useful in some CLIs)
    process.stdin.resume();
  }

  private getEntries() {
    return entries.reduce((acc, entry) => {
      acc[entry] ||= [];
      acc[entry].push([
        `src/${entry}.ts`,
        relative(process.cwd(), resolve(`${entry}_scripts/main`))
      ]);

      glob.sync("**", { cwd: resolve(this.root, "src", entry), nodir: true }).forEach(file => {
        if (file === ".") return;
        const entryFile = `src/${entry}/${file}`;
        const outFile = relative(
          process.cwd(),
          resolve(`${entry}_scripts`, basename(file, extname(file)))
        );
        acc[entry].push([entryFile, outFile]);
      });

      return acc;
    }, {} as Entries);
  }

  private async prepare() {
    this.logger.info(
      "Dear kubejs developer, we are preparing the environment for you. Please wait..."
    );
    await programmaticallyPause();
    const modsDir = resolve(this.root, "mods");
    if (!existsSync(modsDir)) {
      this.logger.error(
        `Please setup project on root directory of minecraft forge project or set --root option as root of forge project.`
      );
      process.exit(1);
    }

    const probeGeneratedDir = resolve(this.root, ".probe");
    if (!existsSync(probeGeneratedDir)) {
      console.warn(
        `Please install ProbeJS mod and run \`/probejs dump\` command in-game for generating files to autocomplete.`
      );
      return;
    }
  }

  private async resolveConfig() {
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

  private async createBuilderFor(entries: Entries, { watch = false }: { watch?: boolean } = {}) {
    const entryPoints = [...entries.client, ...entries.server, ...entries.startup];
    const envNames = new Set<string>();

    // Map entryPoints → environments
    const environments = entryPoints.reduce(
      (acc, [entryFile, outFile]) => {
        const envName = entryFile.replace(/^src\/|\.ts$/g, "");
        envNames.add(envName);
        this.appStates.set(envName, { state: AppState.INITIALIZING });

        acc[envName.replace(/[^\w_$]/g, "$")] = {
          build: {
            outDir: resolve(this.root, "kubejs"),
            lib: {
              name: `kubejs-scripts:${envName}`,
              entry: entryFile,
              fileName: outFile,
              formats: ["es"]
            },
            // watch mode toggled here
            watch: watch ? {} : undefined
          },
          consumer: "client"
        };

        return acc;
      },
      {} as Record<string, EnvironmentOptions>
    );

    const self = this;
    const baseConfig = _.merge<UserConfig, UserConfig>(
      {
        plugins: [swcPlugin(), statsPlugin(() => this._currentEnvName, this.logger)],
        esbuild: false,
        build: {
          emptyOutDir: false,
          minify: "esbuild",
          target: "es2018",
          chunkSizeWarningLimit: Infinity
        },
        logLevel: "silent",
        environments,
        builder: {
          async buildApp(builder) {
            for (const envName of envNames) {
              try {
                self._currentEnvName = envName;
                await builder.build(builder.environments[envName.replace(/[^\w_$]/, "$")]);
              } catch (e) {
                // swallow per-env build errors; you'll still see them in Vite output
              }
            }
          }
        }
      },
      await this.resolveConfig()
    );

    const builder = await createBuilder(baseConfig);
    return { builder, envNames };
  }
}
