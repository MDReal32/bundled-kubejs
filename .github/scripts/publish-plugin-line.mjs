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

const readJson = path => JSON.parse(readFileSync(path, "utf-8"));

const publishCopy = (directory, manifest, version, tag) => {
  if (isPublished(`${publishedName}@${version}`)) {
    console.log(`SKIP ${tag}: ${publishedName}@${version} is already published`);
    return;
  }

  const staging = mkdtempSync(resolve(tmpdir(), "kubejs-plugin-"));
  cpSync(directory, staging, { recursive: true });
  writeFileSync(
    resolve(staging, "package.json"),
    `${JSON.stringify({ ...manifest, name: publishedName, version }, null, 2)}\n`
  );

  console.log(`${dryRun ? "DRY RUN" : "PUBLISH"} ${tag}: ${publishedName}@${version}`);
  npm(
    ["publish", staging, "--access", "public", "--tag", tag, dryRun ? "--dry-run" : "--provenance"],
    { stdio: "inherit" }
  );
};

const line = process.env.LINE;
const isLatest = process.env.LATEST === "true";

if (!line) {
  throw new Error("LINE is required, for example LINE=1.20.");
}

const directory = resolve("libs/plugin/npm", `mc-${line}`);
const manifest = readJson(resolve(directory, "package.json"));

publishCopy(directory, manifest, manifest.version, `mc-${line}`);

if (isLatest) {
  const pluginVersion = readJson(resolve("libs/plugin/package.json")).version;
  publishCopy(directory, manifest, pluginVersion, "latest");
}
