import { extname } from "node:path";

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
export const statsPlugin = (root: string, logger: Logger): Plugin => {
  const buckets = new Map<string, Set<string>>();

  const bucket = (file: string) => {
    if (!buckets.has(file)) buckets.set(file, new Set());
    return buckets.get(file)!;
  };

  return {
    name: "kubejs:stats",
    apply: "build",

    buildStart(options) {
      if (!Array.isArray(options.input)) {
        throw new Error("Please contact developer for handling non array inputs");
      }

      const input = options.input[0];
      this.meta.entryFile = input.replace(root + "/", "");
      const file = this.meta.entryFile.slice(4);
      if (file.match(/^(client|server|startup)/)) {
        this.meta.entry = file.replace(extname(file), "");
      }
    },

    // Fires once per module after parsing (perfect for unique counting)
    moduleParsed(mod) {
      if (mod.id.includes("\0")) return;
      bucket(this.meta.entry).add(mod.id);
    },

    generateBundle(output) {
      if (!output.name) return;
      const env = output.name.slice("kubejs-scripts:".length);
      const count = buckets.get(env)?.size ?? 0;
      const msg = `${env}: ${count} modules`;

      if (this.meta.watchMode) {
        logger.info(`♻️  Rebuilt ${msg}`);
      } else {
        logger.info(`✅ Built ${msg}`);
      }
    }
  };
};
