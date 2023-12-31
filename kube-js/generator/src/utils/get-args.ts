import _ from "lodash";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { ArgOptions } from "../types/arg-options";
import { ModLoaderType } from "../types/mod-loader-type";
import { TemplateGenerateOptions } from "../types/template-generate-options";

export const getArgs = (options: ArgOptions) =>
  yargs(hideBin(process.argv))
    .version(false)
    .option("name", {
      alias: "n",
      type: "string",
      description: "Name of the project"
    })
    .option("version", {
      alias: "v",
      type: "string",
      description: "Version of the project"
    })
    .option("description", {
      alias: "d",
      type: "string",
      description: "Description of the project"
    })
    .option("author", {
      alias: "a",
      type: "string",
      description: "Author of the project"
    })
    .option("mc-version", {
      alias: "m",
      type: "string",
      description: "Minecraft version"
    })
    .option("mod-loader-type", {
      alias: "t",
      type: "string",
      choices: Object.keys(ModLoaderType).map(_.lowerCase),
      description: "Mod loader type"
    })
    .option("template", {
      alias: "p",
      type: "string",
      description: "Template to use",
      choices: Object.keys(options.templates)
    })
    .parse() as unknown as Promise<TemplateGenerateOptions>;
