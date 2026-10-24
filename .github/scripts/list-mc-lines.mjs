import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const npmDirectory = resolve("libs/plugin/npm");

const lines = readdirSync(npmDirectory, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && entry.name.startsWith("mc-"))
  .map(entry =>
    JSON.parse(readFileSync(resolve(npmDirectory, entry.name, "package.json"), "utf-8"))
  )
  .map(manifest => manifest.mcLine)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

process.stdout.write(JSON.stringify(lines));
