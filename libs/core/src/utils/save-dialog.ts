import { execSync } from "node:child_process";
import { cp, rm } from "node:fs/promises";
import { createRequire } from "node:module";

import electron from "electron";

import { Logger } from "./logger";

export const saveDialog = async (fileForSave: string, name: string, outputPath?: string) => {
  const logger = new Logger("KubeJS Core/Saver");
  const cmd: string[] = [];

  if (!outputPath) {
    logger.info(`Opening save dialog...`);

    const require = createRequire(import.meta.url);
    const dialogExecutable = require.resolve("@kubejs/core/dialog");

    cmd.push(electron as unknown as string, dialogExecutable, name);

    outputPath = execSync(cmd.join(" ")).toString();
  }

  const saveTo = outputPath.trim();

  if (!saveTo) {
    await rm(fileForSave, { recursive: true });
    throw new Error("Process cancelled");
  }

  await cp(fileForSave, saveTo, { recursive: true });
  logger.info(`File saved!`);
};
