import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const publishedName = "@kubejs/plugin";
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
const manifest = JSON.parse(readFileSync(resolve(directory, "package.json"), "utf-8"));
const { version } = manifest;

if (isPublished(`${publishedName}@${version}`)) {
  console.log(`SKIP ${tag}: ${publishedName}@${version} is already published`);
  process.exit(0);
}

const staging = mkdtempSync(resolve(tmpdir(), "kubejs-plugin-"));
cpSync(directory, staging, { recursive: true });
writeFileSync(
  resolve(staging, "package.json"),
  JSON.stringify({ ...manifest, name: publishedName }, null, 2) + "\n"
);

console.log(`${dryRun ? "DRY RUN" : "PUBLISH"} ${tag}: ${publishedName}@${version}`);
npm(
  ["publish", staging, "--access", "public", "--tag", tag, dryRun ? "--dry-run" : "--provenance"],
  { stdio: "inherit" }
);

if (!dryRun && isLatest) {
  npm(["dist-tag", "add", `${publishedName}@${version}`, "latest"], { stdio: "inherit" });
}
