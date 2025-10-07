import type { Plugin } from "vite";

import type { Logger } from "@kubejs/core";

/**
 * Counts unique modules that Rollup parses for a given envName.
 */
export const statsPlugin = (getCurrentEnv: () => string, logger: Logger): Plugin => {
  const buckets = new Map<string, Set<string>>();

  const bucket = () => {
    const env = getCurrentEnv();
    if (!buckets.has(env)) buckets.set(env, new Set());
    return buckets.get(env)!;
  };

  return {
    name: "kubejs:stats",
    apply: "build",

    buildStart() {
      const env = getCurrentEnv();
      buckets.set(env, new Set());
    },

    // Fires once per module after parsing (perfect for unique counting)
    moduleParsed(mod) {
      if (mod.id.includes("\0")) return;
      bucket().add(mod.id);
    },

    generateBundle() {
      const env = getCurrentEnv();
      const count = buckets.get(env)?.size ?? 0;
      const msg = `${env}: ${count} modules`;

      if (this.meta.watchMode) {
        // logger.info(`♻️  Rebuilt ${msg}`);
      } else {
        logger.info(`✅ Built ${msg}`);
      }
    }
  };
};
