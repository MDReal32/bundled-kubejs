import _ from "lodash";
import { parse } from "semver";

import { input, select } from "@inquirer/prompts";
import { ModLoaderType, TemplateGenerateOptions } from "@kubejs/core";

import { getMinecraftVersions } from "./minecraft/get-minecraft-versions";
import { TemplatesConfig } from "./templates";

export const questionary = async (
  initialArgs: Partial<TemplateGenerateOptions>,
  templates: TemplatesConfig
) => {
  const templateNameMap: Record<string, string> = {};
  const templateNames = Object.entries(templates).map(([_key, config]) => {
    templateNameMap[config.name] = _key;
    return config.name;
  });

  const templateGenerateOptions: Partial<TemplateGenerateOptions> = { ...initialArgs };

  if (!initialArgs.name) {
    templateGenerateOptions.name = await input({
      message: "What is the name of your project?",
      default: initialArgs.name,
      required: true,
      validate: val => val.length > 0
    });
  }

  if (!initialArgs.version) {
    templateGenerateOptions.version = await input({
      message: "What is the version of your project?",
      default: initialArgs.version,
      validate: val => val.length > 0 && parse(val) !== null,
      required: true
    });
  }

  if (!initialArgs.mcVersion) {
    const mcVersions = await getMinecraftVersions();

    if (mcVersions.length > 0) {
      templateGenerateOptions.mcVersion = await select({
        message: "What is the Minecraft version of your project?",
        choices: await getMinecraftVersions(),
        default: initialArgs.mcVersion,
        pageSize: 8
      });
    }
  }

  if (!initialArgs.modLoaderType) {
    templateGenerateOptions.modLoaderType = await select({
      message: "What mod loader do you want to use?",
      choices: Object.keys(ModLoaderType).map(_.capitalize),
      default: initialArgs.modLoaderType
    });
  }

  if (!initialArgs.template) {
    templateGenerateOptions.template = await select({
      message: "What template do you want to use?",
      choices: templateNames,
      pageSize: 5,
      default: initialArgs.template
    });
  }

  if (templateGenerateOptions.template) {
    templateGenerateOptions.template = templateNameMap[templateGenerateOptions.template];
  }

  return _.merge(initialArgs, templateGenerateOptions) as TemplateGenerateOptions;
};
