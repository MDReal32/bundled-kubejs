import type { Logger } from "@kubejs/core";

import { defaultMcVariant, mcVariants } from "./const";
import { detectMcVersion } from "./detect-mc-version";
import type { McLine } from "./mc-variant";

export const resolveMcVariant = async (root: string, logger: Logger) => {
  const version = await detectMcVersion(root);
  if (!version) {
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

  logger.info(`Using the Minecraft ${variant.line} variant (detected ${version}).`);
  return variant;
};
