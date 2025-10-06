import {
  Logger,
  TemplateGenerateOptions,
  generateManifest,
  generateModListHtml,
  prepareArchiver,
  saveDialog
} from "@kubejs/core";

import { RequiredModFiles } from "../types/mc/required-mod-files";
import { questionary } from "../utils/questionary";
import { Templates } from "../utils/templates";

export const generate = async (args: TemplateGenerateOptions, templates: Templates) => {
  const logger = new Logger("KubeJS Generator");
  const options = await questionary(args, templates.templates);

  const archiver = await prepareArchiver(options);
  const template = templates.loadTemplate(options.template);
  await template.prepare();
  await template.generate(options);

  const modIds = [RequiredModFiles.KubeJS, RequiredModFiles.ProbeJS];
  const manifest = await generateManifest(modIds, options);
  archiver.addFile("manifest.json", JSON.stringify(manifest));

  const modlistHtml = await generateModListHtml(modIds, options);
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
