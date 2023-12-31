import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

import yaml from "yaml";

import {
  YarnInitOptions,
  YarnInstallOptions,
  YarnSetVersionOptions
} from "../../../types/commands/yarn";
import { CommandExecutor } from "../../command-executor";
import { LogActions } from "../../logger/log-actions";

@LogActions("Yarn")
export class Yarn extends CommandExecutor {
  constructor() {
    super("yarn");
  }

  async init(options: YarnInitOptions) {
    this.logger.info("Initializing yarn");
    await this.updateYarnRc(options.cwd);

    const cmd = this.commandBuilder.clone();
    cmd.addCommand("init").addFlag("yes");
    options.name && cmd.addOption("name", options.name);
    await this.exec(cmd, options);
    const pkgJsonFilePath = `${options.cwd}/package.json`;
    const oldPkgJson = JSON.parse(await readFile(pkgJsonFilePath, "utf-8"));
    await writeFile(
      pkgJsonFilePath,
      JSON.stringify({ ...oldPkgJson, name: options.name }, null, 2),
      "utf-8"
    );
  }

  get set() {
    const cmd = this.commandBuilder.clone().addCommand("set");
    const self = this;
    return {
      async version(options: YarnSetVersionOptions) {
        await self.exec(
          cmd
            .clone()
            .addCommand("version")
            .addArgument("stable")
            .addFlag("yarn-path", options.yarnPath),
          options
        );
      }
    };
  }

  async install(options: YarnInstallOptions) {
    await this.exec(this.commandBuilder.clone().addCommand("install"), options);
  }

  private async updateYarnRc(root: string) {
    const yarnRcFile = `${root}/.yarnrc.yml`;
    if (existsSync(yarnRcFile)) {
      const contentOfYarnRc = await readFile(yarnRcFile, "utf-8");
      const json = yaml.parse(contentOfYarnRc);
      json.nodeLinker = "node-modules";
      await writeFile(yarnRcFile, yaml.stringify(json), "utf-8");
    } else {
      await writeFile(yarnRcFile, "nodeLinker: node-modules", "utf-8");
    }
  }
}
