import _ from "lodash";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { ModLoaderType, TemplateGenerateOptions } from "@kubejs/core";

import pkg from "../package.json" with { type: "json" };
import { generate } from "./core/generate";
import { migrate } from "./core/migrate";
import { Templates } from "./utils/templates";

const main = async () => {
  const templates = new Templates();
  await templates.prepare();

  await yargs(hideBin(process.argv))
    .command(
      "generate",
      "Generate new CurseForge project",
      args =>
        args
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
            choices: Object.keys(ModLoaderType)
              .map(_.lowerCase)
              .filter(s => !s.match(/\d+/)),
            description: "Mod loader type"
          })
          .option("template", {
            alias: "p",
            type: "string",
            description: "Template to use",
            choices: Object.keys(templates.templates)
          })
          .option("output", {
            alias: "o",
            type: "string",
            description: "Where to output result"
          }),
      async argv => {
        try {
          await generate(argv as unknown as TemplateGenerateOptions, templates);
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      }
    )
    .command(
      "migrate",
      "Migrate existing project to new template",
      args => args,
      async argv => {
        console.log(argv);

        try {
          await migrate();
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      }
    )
    .scriptName("kubejs-generator")
    .strict()
    .strictOptions()
    .strictCommands()
    .help()
    .version(pkg.version)
    .demandCommand(1, "You need to call one of the given commands or options.")
    .parse();
};

await main();
