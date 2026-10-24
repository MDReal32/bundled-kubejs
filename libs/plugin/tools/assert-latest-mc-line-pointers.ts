import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { latestMcLine } from "./latest-mc-line";

interface PointerManifest {
  main: string;
  types: string;
  bin: { kubejs: string };
  files: string[];
  exports: { ".": { types: string; import: string; require: string } };
}

export const assertLatestMcLinePointers = (packageRoot: string, lines: string[]) => {
  const latest = latestMcLine(lines);
  const manifest = JSON.parse(
    readFileSync(resolve(packageRoot, "package.json"), "utf-8")
  ) as PointerManifest;
  const entry = `npm/mc-${latest}/build/kubejs.plugin.js`;
  const types = `npm/mc-${latest}/build/kubejs.plugin.d.ts`;
  const bin = `npm/mc-${latest}/bin/cli.js`;
  const files = [`npm/mc-${latest}/build`, `npm/mc-${latest}/bin`];
  const actual = [
    manifest.bin.kubejs,
    manifest.main,
    manifest.types,
    manifest.exports["."].types,
    manifest.exports["."].import,
    manifest.exports["."].require
  ];
  const expected = [bin, entry, types, `./${types}`, `./${entry}`, `./${entry}`];

  const missingFiles = files.filter(file => !manifest.files.includes(file));

  if (actual.join() !== expected.join() || missingFiles.length > 0) {
    throw new Error(
      `package.json bin, main, types, exports and files must point at the latest Minecraft line (${latest}). Expected ${expected.join(", ")} and files ${files.join(", ")} but found ${actual.join(", ")} and files ${manifest.files.join(", ")}.`
    );
  }
};
