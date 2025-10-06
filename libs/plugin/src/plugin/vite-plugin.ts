import type { Plugin } from "vite";

import { isNodeInternalModule } from "../utils/is-node-internal-module";

export default function vitePlugin(): Plugin {
  return {
    name: "kubejs:vite-plugin",
    enforce: "pre",

    resolveId(id) {
      if (isNodeInternalModule(id)) {
        this.error(`Node's internal modules are not usable in Rhino environment.`);
      }
    }
  };
}
