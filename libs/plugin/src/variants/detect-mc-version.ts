import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

interface InstanceFile {
  minecraft?: string;
}

interface MinecraftInstanceFile {
  manifest?: { minecraft?: { version?: string } };
}

const readJson = async <T>(path: string) => JSON.parse(await readFile(path, "utf-8")) as T;

export const detectMcVersion = async (root: string) => {
  const instancePath = resolve(root, "instance.json");
  if (existsSync(instancePath)) {
    const instance = await readJson<InstanceFile>(instancePath);
    if (typeof instance.minecraft === "string") {
      return instance.minecraft;
    }
  }

  const minecraftInstancePath = resolve(root, "minecraftinstance.json");
  if (existsSync(minecraftInstancePath)) {
    const instance = await readJson<MinecraftInstanceFile>(minecraftInstancePath);
    return instance.manifest?.minecraft?.version;
  }

  return undefined;
};
