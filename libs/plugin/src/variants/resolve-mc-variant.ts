import type { Logger } from "@kubejs/core";

import { defaultMcVariant, mcVariants } from "./const";
import { detectMcVersion } from "./detect-mc-version";
import type { McLine } from "./mc-variant";

const bakedLine = typeof __MC_LINE__ === "undefined" ? undefined : __MC_LINE__;

export const resolveMcVariant = async (root: string, logger: Logger) => {
  const version = await detectMcVersion(root);
  if (!version) {
    if (bakedLine) {
      logger.info(
        `No Minecraft version found in the project, using the baked ${bakedLine} variant.`
      );
      return mcVariants[bakedLine];
    }

    logger.info(
      "No instance.json or minecraftinstance.json found, using the default Minecraft variant."
    );
    return defaultMcVariant;
  }

  const line = version.match(/^\d+\.\d+/)?.[0] as McLine | undefined;
  const variant = line && mcVariants[line];
  if (!variant) {
    throw new Error(
      `Unsupported Minecraft version ${version}. Supported lines: ${Object.keys(mcVariants).join(", ")}.`
    );
  }

  if (bakedLine && bakedLine !== variant.line) {
    throw new Error(
      `This build of @kubejs/plugin targets Minecraft ${bakedLine} but the project uses ${version}. Install @kubejs/plugin@mc-${variant.line}.`
    );
  }

  logger.info(`Using the Minecraft ${variant.line} variant (detected ${version}).`);
  return variant;
};
