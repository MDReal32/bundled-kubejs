import { readFileSync } from "node:fs";
import { resolve } from "node:path";

interface LineManifest {
  name: string;
  mcLine: string;
  publishConfig: { tag: string };
}

export const assertLinePackages = (packageRoot: string, lines: string[]) => {
  for (const line of lines) {
    const manifestPath = resolve(packageRoot, "npm", `mc-${line}`, "package.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8")) as LineManifest;

    if (manifest.name !== "@kubejs/plugin" || manifest.mcLine !== line) {
      throw new Error(`${manifestPath} must be @kubejs/plugin with mcLine "${line}".`);
    }

    if (manifest.publishConfig.tag !== `mc-${line}`) {
      throw new Error(`${manifestPath} must publish with the dist-tag mc-${line}.`);
    }
  }
};
