import { randomBytes } from "node:crypto";
import { rmSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import tempDir from "temp-dir";

import { Archiver } from "../core";
import type { TemplateGenerateOptions } from "../types";
import { Logger } from "./index";

export const prepareArchiver = async (
  options: Pick<TemplateGenerateOptions, "name" | "tmpDestination">
) => {
  const logger = new Logger("KubeJS Core/Archive Preloader");
  const key = randomBytes(4).toString("hex");

  options.tmpDestination = resolve(tempDir, "kubejs-generator", `${options.name}-${key}`);
  await mkdir(dirname(options.tmpDestination), { recursive: true });

  process.on("exit", () => {
    logger.info(`Cleaning up...`);
    rmSync(options.tmpDestination, { recursive: true, force: true });
    rmSync(`${options.tmpDestination}.zip`, { force: true });
    logger.info(`Cleaning up... done`);
  });

  logger.info(`Preparing archiver at ${options.tmpDestination}.zip`);
  return new Archiver(`${options.tmpDestination}.zip`);
};
