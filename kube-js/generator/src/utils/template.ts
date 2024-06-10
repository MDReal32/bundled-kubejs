import { statSync } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";

import { renderFile } from "ejs";

import { TemplateConfig } from "../types/template-config";
import { TemplateGenerateOptions } from "../types/template-generate-options";
import { GeneratorExtension } from "./generator/generator-extension";
import { Logger } from "./logger/logger";

export class Template {
  private readonly generatorExtension = new GeneratorExtension();
  private readonly logger = new Logger("Template");

  private templateFiles: string[] = [];

  constructor(private readonly __template: TemplateConfig) {}

  async prepare() {
    await mkdir(this.__template.path, { recursive: true });
    this.templateFiles = await this.deepScan(this.__template.path);
  }

  async generate(options: TemplateGenerateOptions) {
    const data = { name: options.name, version: options.version };
    const destination = resolve(options.tmpDestination);
    await mkdir(destination, { recursive: true });

    this.logger.info("Generating files");
    for (const templateFile of this.templateFiles) {
      if (templateFile === this.__template.configFileName) continue;
      const content = await renderFile(templateFile, data, { async: true });
      const dest = templateFile.replace(this.__template.path, destination).replace(/\.ejs$/, "");
      await mkdir(dirname(dest), { recursive: true });
      await writeFile(dest, content);
      this.logger.info(`Generated ${dest.replace(`${destination}${sep}`, "")}`);
    }
    this.logger.info("Generating files done");

    await this.generatorExtension.setupGit({ cwd: destination });
  }

  private async deepScan(dir: string) {
    const result: string[] = [];
    const files = await readdir(dir);
    for (const file of files) {
      const path = resolve(dir, file);
      const stats = statSync(path);
      if (stats.isDirectory()) {
        result.push(...(await this.deepScan(path)));
      } else {
        result.push(path);
      }
    }
    return result;
  }
}
