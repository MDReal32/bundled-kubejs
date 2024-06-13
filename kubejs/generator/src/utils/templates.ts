import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

import { Logger } from "@kubejs/core";

import { TemplateConfig } from "../types/template-config";
import { Template } from "./template";

export type TemplatesConfig = Record<string, TemplateConfig>;

export class Templates {
  private readonly __templates: TemplatesConfig = {};
  private readonly logger = new Logger("Templates");

  get templates() {
    return this.__templates;
  }

  async prepare() {
    const require = createRequire(import.meta.url);
    const basePath = require.resolve("@kubejs/generator");

    const root = resolve(dirname(dirname(basePath)), "template");
    for (const template of await readdir(root)) {
      const templateRoot = resolve(root, template);
      let templateJsonSource: string;
      try {
        templateJsonSource = await readFile(resolve(templateRoot, "template.json"), "utf-8");
      } catch (error) {
        this.logger.error(`Failed to load template for ${template}`);
        continue;
      }

      let templateConfig: TemplateConfig;
      try {
        templateConfig = JSON.parse(templateJsonSource);
        templateConfig.path = templateRoot;
        templateConfig.configFileName = resolve(templateRoot, "template.json");
      } catch (error) {
        this.logger.error(`Failed to load template for ${template}`);
        continue;
      }

      this.__templates[template] = templateConfig;
    }
  }

  loadTemplate(template: string) {
    if (!this.__templates[template]) {
      throw new Error(`Template ${template} does not exist`);
    }

    return new Template(this.__templates[template]);
  }
}
