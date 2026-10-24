import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const dryRun = process.env.DRY_RUN === "true";
const isWindows = process.platform === "win32";

const quote = arg => (isWindows ? `"${arg}"` : arg);

const npm = (args, options = {}) =>
  execFileSync(isWindows ? "npm.cmd" : "npm", isWindows ? args.map(quote) : args, {
    encoding: "utf-8",
    shell: isWindows,
    ...options
  });

const isPublished = spec => {
  try {
    return npm(["view", spec, "version"], { stdio: ["ignore", "pipe", "ignore"] }).trim() !== "";
  } catch {
    return false;
  }
};

const line = process.env.LINE;
const isLatest = process.env.LATEST === "true";

if (!line) {
  throw new Error("LINE is required, for example LINE=1.20.");
}

const tag = `mc-${line}`;
const directory = resolve("libs/plugin/npm", tag);
const { name, version } = JSON.parse(readFileSync(resolve(directory, "package.json"), "utf-8"));

if (isPublished(`${name}@${version}`)) {
  console.log(`SKIP ${tag}: ${name}@${version} is already published`);
  process.exit(0);
}

console.log(`${dryRun ? "DRY RUN" : "PUBLISH"} ${tag}: ${name}@${version}`);
npm(
  ["publish", directory, "--access", "public", "--tag", tag, dryRun ? "--dry-run" : "--provenance"],
  { stdio: "inherit" }
);

if (!dryRun && isLatest) {
  npm(["dist-tag", "add", `${name}@${version}`, "latest"], { stdio: "inherit" });
}
