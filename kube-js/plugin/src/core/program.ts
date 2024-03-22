import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { UserConfig, UserConfigExport, build } from "vite";

import babel from "@rollup/plugin-babel";

import { __dirname } from "../const";

type Entry = "client" | "server" | "startup";

enum AppState {
  INITIALIZING = "Initializing",
  PREPARING = "Preparing",
  RUNNING = "Running",
  SUCCEEDED = "Succeeded",
  FAILED = "Failed",
  ENTRY_NOT_FOUND = "Entry not found"
}

export class Program<TCmdOptions extends string | number, TArgs> {
  private appStates: Record<Entry, AppState> = {
    client: AppState.INITIALIZING,
    server: AppState.INITIALIZING,
    startup: AppState.INITIALIZING
  };

  constructor(
    public cmd: TCmdOptions,
    public options: TCmdOptions[],
    public args: TArgs
  ) {}

  async patch() {
    // Patch the output scripts due to rhino made the var scoped
    const outputs = ["client", "server", "startup"].map(env =>
      resolve(`kubejs/${env}_scripts/script.js`)
    );

    // Load the file and split the lines
    const promises = outputs.map(async file => {
      const content = await readFile(file, "utf-8");
      const lines = content.split("\n");

      // function l() {
      //   try {
      //     var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      //     }));
      //   } catch (t) {
      //   }
      //   return (l = function() {
      //     return !!e;
      //   })();
      // }

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

  async build() {
    this.log();
    await this.await(1);

    this.appStates.client = AppState.PREPARING;
    this.appStates.server = AppState.PREPARING;
    this.appStates.startup = AppState.PREPARING;
    this.log();

    await this.prepare();

    const envs: Entry[] = ["client", "server", "startup"];
    const promises = envs.map(async env => {
      const entryFile = resolve(`src/${env}.ts`);
      const outputFile = resolve(`kubejs/${env}_scripts/script.js`);
      if (!existsSync(entryFile)) {
        await mkdir(dirname(outputFile), { recursive: true });
        await writeFile(outputFile, "");
        this.appStates[env] = AppState.ENTRY_NOT_FOUND;
        this.log();
        return;
      }

      this.appStates[env] = AppState.RUNNING;
      this.log();

      const baseConfig: UserConfig = {
        build: {
          emptyOutDir: false,
          outDir: resolve(process.cwd(), "kubejs"),
          lib: {
            name: `${env}-scripts`,
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
              })
            ]
          }
        },
        logLevel: "silent"
      };

      const userDefinedConfigFile = resolve(process.cwd(), "vite.config.js");
      if (existsSync(userDefinedConfigFile)) {
        const userDefinedConfig = (await import(userDefinedConfigFile)) as UserConfigExport;
        if (typeof userDefinedConfig === "function") {
          const result = await userDefinedConfig({
            command: "build",
            isPreview: false,
            isSsrBuild: false,
            mode: "production"
          });
          Object.assign(baseConfig, result);
        }
      }

      try {
        await build(baseConfig);
        this.appStates[env] = AppState.SUCCEEDED;
        this.log();
      } catch (e) {
        this.appStates[env] = AppState.FAILED;
        this.log();
      }
    });

    await Promise.all(promises);
    await this.patch();
    this.log();
  }

  execute() {
    switch (this.cmd) {
      case "build":
        return this.build();

      default:
        console.log("No command specified");
    }
  }

  private async prepare() {
    const modsDir = resolve(process.cwd(), "mods");
    if (!existsSync(modsDir))
      throw new Error(`Please setup project on root directory of minecraft forge project.`);

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

  private log() {
    const message = `
Hello dear KubeJS developer! Building project for you... State of parts:
 - Client: ${this.colorizeState(this.appStates.client)}${" ".repeat(6)}
 - Server: ${this.colorizeState(this.appStates.server)}${" ".repeat(6)}
 - Startup: ${this.colorizeState(this.appStates.startup)}${" ".repeat(6)}
`.trimStart();
    process.stdout.moveCursor(0, -message.split("\n").length);
    console.log(message);
  }

  private await(s: number) {
    return new Promise(resolve => setTimeout(resolve, s * 1e3));
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
}
