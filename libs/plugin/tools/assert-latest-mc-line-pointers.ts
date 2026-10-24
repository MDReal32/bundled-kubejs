import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { latestMcLine } from "./latest-mc-line";

interface PointerManifest {
  main: string;
  types: string;
  exports: { ".": { types: string; import: string; require: string } };
}

export const assertLatestMcLinePointers = (packageRoot: string, lines: string[]) => {
  const latest = latestMcLine(lines);
  const manifest = JSON.parse(
    readFileSync(resolve(packageRoot, "package.json"), "utf-8")
  ) as PointerManifest;
  const entry = `npm/mc-${latest}/build/kubejs.plugin.js`;
  const types = `npm/mc-${latest}/build/kubejs.plugin.d.ts`;
  const actual = [
    manifest.main,
    manifest.types,
    manifest.exports["."].types,
    manifest.exports["."].import,
    manifest.exports["."].require
  ];
  const expected = [entry, types, `./${types}`, `./${entry}`, `./${entry}`];

  if (actual.join() !== expected.join()) {
    throw new Error(
      `package.json main, types and exports must point at the latest Minecraft line (${latest}). Expected ${expected.join(", ")} but found ${actual.join(", ")}.`
    );
  }
};
