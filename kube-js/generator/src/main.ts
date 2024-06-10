import { randomBytes } from "node:crypto";
import { rm } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { memfs } from "memfs";
import tempDir from "temp-dir";

import { questionary } from "./questionary";
import { ArgOptions } from "./types/arg-options";
import { Archiver } from "./utils/archiver";
import { generateManifest } from "./utils/generate-manifest";
import { generateModListHtml } from "./utils/generate-mod-list-html";
import { getArgs } from "./utils/get-args";
import { Logger } from "./utils/logger/logger";
import { saveDialog } from "./utils/save-dialog";
import { Templates } from "./utils/templates";

export const __dirname = fileURLToPath(new URL(".", import.meta.url));

const fs = memfs();
const templates = new Templates(fs.fs);
await templates.prepare();
const logger = new Logger("KubeJS Generator");

const argOptions: ArgOptions = {
  templates: templates.templates
};

const args = await getArgs(argOptions);
const options = await questionary(args, argOptions);
const key = randomBytes(4).toString("hex");
options.tmpDestination = resolve(tempDir, "kubejs-generator", `${options.name}-${key}`);

const archiver = new Archiver(`${options.tmpDestination}.zip`);
const template = templates.loadTemplate(options.template);
await template.prepare();
await template.generate(options);

const manifest = await generateManifest(options);
archiver.addFile("manifest.json", JSON.stringify(manifest));

const modlistHtml = await generateModListHtml(options);
archiver.addFile("modlist.html", modlistHtml);

archiver.directory(resolve(options.tmpDestination), "overrides");
const filesJson = fs.vol.toJSON(options.tmpDestination);
for (const file in filesJson) {
  const content = filesJson[file];
  if (content) {
    const dest = options.tmpDestination.split(sep).slice(1).join("/");
    const path = file
      .split("/")
      .slice(1)
      .join("/")
      .replace(new RegExp(`^${dest}`), "overrides");

    archiver.addFile(path, content);
  }
}

await archiver.archive();
logger.info(`Generated CurseForge project at ${options.tmpDestination}.zip`);

logger.info(`Cleaning up...`);
await rm(options.tmpDestination, { recursive: true, force: true });
logger.info(`Cleaning up... done`);

logger.info(`Opening save dialog...`);
await saveDialog(
  `${options.tmpDestination}.zip`,
  `${templates.templates[options.template].name} ${options.mcVersion}-${options.version}`
);
logger.info(`File saved!`);
