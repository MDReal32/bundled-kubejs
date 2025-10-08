import type { Plugin } from "vite";

import type { Logger } from "@kubejs/core";

declare module "rollup" {
  interface PluginContextMeta {
    entryFile: string;
    entry: string;
  }
}

/**
 * Counts unique modules that Rollup parses for a given envName.
 */
export const statsPlugin = (logger: Logger): Plugin => {
  return {
    name: "kubejs:stats",
    apply: "build",

    generateBundle(output, bundle) {
      if (!output.name) return;
      const currentBundle = bundle[Object.keys(bundle)[0]];
      if (currentBundle.type !== "chunk")
        throw new Error("Please contact to developer for improving that section of code.");

      const env = output.name.slice("kubejs-scripts:".length);
      const msg = `${env}: ${currentBundle.moduleIds.length} modules`;

      if (this.meta.watchMode) {
        logger.info(`♻️  Rebuilt ${msg}`);
      } else {
        logger.info(`✅ Built ${msg}`);
      }
    }
  };
};
