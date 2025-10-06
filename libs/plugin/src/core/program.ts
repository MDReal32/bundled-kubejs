import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  CfMinecraftInstance,
  Logger,
  ModLoaderType,
  TemplateGenerateOptions,
  generateManifest,
  generateModListHtml,
  prepareArchiver,
  saveDialog
} from "@kubejs/core";

import { Args } from "../types/args";
import { Vite } from "./vite";

interface PackOptions {
  outfile?: string;
  outdir?: string;
}

export class Program<TArgs extends Args> {
  private readonly vite;

  constructor(private readonly args: TArgs) {
    this.vite = new Vite(args);
  }

  execute() {
    if (this.args.watch) {
      return this.vite.watch();
    } else {
      return this.vite.build();
    }
  }

  async pack(opts: PackOptions = {}) {
    const logger = new Logger("KubeJS Plugin/Packager");

    const appVersion = existsSync(resolve("package.json"))
      ? JSON.parse(await readFile(resolve("package.json"), "utf-8")).version
      : "0.0.0";

    const minecraftInstance: CfMinecraftInstance = await readFile(
      resolve("minecraftinstance.json"),
      "utf-8"
    ).then(JSON.parse);

    const options: Pick<
      TemplateGenerateOptions,
      "name" | "tmpDestination" | "mcVersion" | "modLoaderType"
    > = {
      name: minecraftInstance.manifest.name,
      tmpDestination: "",
      mcVersion: minecraftInstance.manifest.minecraft.version,
      modLoaderType:
        (minecraftInstance.manifest.minecraft.modLoaders
          .find(mt => mt.primary)
          ?.id.split("-")[0] as unknown as ModLoaderType) || ModLoaderType.FORGE
    };

    const exportedManifest = await generateManifest(
      minecraftInstance.manifest.files.map(file => file.projectID),
      options
    );

    const { outfile, outdir } = opts;
    const outfilePath = outfile ? resolve(outfile) : resolve(outdir ?? "dist", options.name);

    logger.info("Packing the project...");
    const archive = await prepareArchiver(options);

    const overrideNames = [
      "config",
      "src",
      ".editorconfig",
      ".gitattributes",
      ".gitignore",
      ".prettierrc",
      ".yarnrc.yml",
      "README.md",
      "package.json",
      "tsconfig.json"
    ];

    for (const directory of overrideNames) {
      const filename = resolve(directory);
      const stats = statSync(filename);

      if (stats.isDirectory()) {
        existsSync(filename) && archive.directory(filename, `overrides/${directory}`);
      } else {
        existsSync(filename) && archive.file(filename, `overrides/${directory}`);
      }
    }

    archive.addFile("manifest.json", JSON.stringify(exportedManifest));
    archive.addFile(
      "modlist.html",
      await generateModListHtml(
        exportedManifest.files.map(file => file.projectID),
        options
      )
    );

    logger.info(`Generated CurseForge project at ${options.tmpDestination}.zip`);
    await archive.archive();

    await saveDialog(
      `${options.tmpDestination}.zip`,
      `${options.name} ${exportedManifest.minecraft.version}-${appVersion}`,
      outfilePath
    );
  }
}
