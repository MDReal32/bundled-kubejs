import { randomBytes } from "node:crypto";
import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import tempDir from "temp-dir";

import { ArgOptions } from "./types/arg-options";
import { Archiver } from "./utils/archiver";
import { getArgs } from "./utils/get-args";
import { Logger } from "./utils/logger/logger";
import { generateManifest } from "./utils/minecraft/generate-manifest";
import { generateModListHtml } from "./utils/minecraft/generate-mod-list-html";
import { questionary } from "./utils/questionary";
import { saveDialog } from "./utils/save-dialog";
import { Templates } from "./utils/templates";

export const __dirname = fileURLToPath(new URL(".", import.meta.url));

export const main = async () => {
  const logger = new Logger("KubeJS Generator");
  const templates = new Templates();
  await templates.prepare();
  const argOptions: ArgOptions = { templates: templates.templates };

  const args = await getArgs(argOptions);
  const options = await questionary(args, argOptions);
  const key = randomBytes(4).toString("hex");
  options.tmpDestination = resolve(tempDir, "kubejs-generator", `${options.name}-${key}`);

  process.on("exit", () => {
    logger.info(`Cleaning up...`);
    rmSync(options.tmpDestination, { recursive: true, force: true });
    rmSync(`${options.tmpDestination}.zip`, { force: true });
    logger.info(`Cleaning up... done`);
  });

  const archiver = new Archiver(`${options.tmpDestination}.zip`);
  const template = templates.loadTemplate(options.template);
  await template.prepare();
  await template.generate(options);

  const manifest = await generateManifest(options);
  archiver.addFile("manifest.json", JSON.stringify(manifest));

  const modlistHtml = await generateModListHtml(options);
  archiver.addFile("modlist.html", modlistHtml);

  archiver.directory(options.tmpDestination, "overrides");

  await archiver.archive();
  logger.info(`Generated CurseForge project at ${options.tmpDestination}.zip`);

  logger.info(`Opening save dialog...`);
  await saveDialog(
    `${options.tmpDestination}.zip`,
    `${options.name} ${options.mcVersion}-${options.version}`
  );
  logger.info(`File saved!`);
};
