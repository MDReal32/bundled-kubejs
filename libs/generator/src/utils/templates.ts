import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

import { Logger } from "@kubejs/core";

import { TemplateConfig } from "../types/template-config";
import { Template } from "./template";

const __dirname = dirname(new URL(import.meta.url).pathname);

export interface TemplatesConfig extends Record<string, TemplateConfig> {}

export class Templates {
  private readonly __templates: TemplatesConfig = {};
  private readonly logger = new Logger("Templates");

  get templates() {
    return this.__templates;
  }

  async prepare() {
    const require = createRequire(import.meta.url);
    let basePath: string = null!;

    try {
      basePath = require.resolve("@kubejs/generator");
    } catch (e) {
      const { loadConfig } = await import("tsconfig-paths");
      const result = loadConfig(__dirname);
      if (result.resultType === "failed") {
        throw e;
      }

      basePath = resolve(result.absoluteBaseUrl, result.paths["@kubejs/generator"][0]);
    }

    const root = resolve(dirname(dirname(basePath)), "templates");
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
