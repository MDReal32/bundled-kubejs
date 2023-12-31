import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

import { IFs } from "memfs";

import { __dirname } from "../main";
import { TemplateConfig } from "../types/template-config";
import { Logger } from "./logger/logger";
import { Template } from "./template";

export class Templates {
  private readonly __templates: Record<string, TemplateConfig> = {};
  private readonly logger = new Logger("Templates");

  constructor(private readonly fs: IFs) {}

  get templates() {
    return this.__templates;
  }

  async prepare() {
    const root = resolve(__dirname, "../template");
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

    return new Template(this.__templates[template], this.fs);
  }
}
