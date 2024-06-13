import { createPromptModule } from "inquirer";
import _ from "lodash";

import { ModLoaderType, TemplateGenerateOptions } from "@kubejs/core";

import { getMinecraftVersions } from "./minecraft/get-minecraft-versions";
import { TemplatesConfig } from "./templates";

export const questionary = async (
  initialArgs: Partial<TemplateGenerateOptions>,
  templates: TemplatesConfig
) => {
  const module = createPromptModule();

  const templateNameMap: Record<string, string> = {};
  const templateNames = Object.entries(templates).map(([_key, config]) => {
    templateNameMap[config.name] = _key;
    return config.name;
  });

  const answers = await module<TemplateGenerateOptions>([
    {
      name: "name",
      type: "input",
      message: "What is the name of your project?",
      default: initialArgs.name,
      when: !initialArgs.name
    },
    {
      name: "version",
      type: "input",
      message: "What is the version of your project?",
      default: initialArgs.version,
      when: !initialArgs.version
    },
    {
      name: "mcVersion",
      type: "list",
      message: "What is the Minecraft version of your project?",
      choices: await getMinecraftVersions(),
      default: initialArgs.mcVersion,
      when: !initialArgs.mcVersion
    },
    {
      name: "modLoaderType",
      type: "list",
      message: "What mod loader do you want to use?",
      choices: Object.keys(ModLoaderType).map(_.capitalize),
      default: initialArgs.modLoaderType,
      when: !initialArgs.modLoaderType
    },
    {
      name: "template",
      type: "list",
      message: "What template do you want to use?",
      choices: templateNames,
      pageSize: 5,
      default: initialArgs.template,
      when: !initialArgs.template
    }
  ]);

  if (answers.template) {
    answers.template = templateNameMap[answers.template];
  }

  return _.merge<Partial<TemplateGenerateOptions>, TemplateGenerateOptions>(
    initialArgs,
    answers
  ) as TemplateGenerateOptions;
};
