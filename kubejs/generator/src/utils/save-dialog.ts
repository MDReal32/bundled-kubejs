import { execSync } from "node:child_process";
import { cp, rm } from "node:fs/promises";
import { resolve } from "node:path";

import electron from "electron";

import { __dirname } from "../main";

export const saveDialog = async (fileForSave: string, name: string) => {
  const cmd: string[] = [];

  cmd.push(electron as unknown as string, resolve(__dirname, "dialog.js"), `"${name}"`);

  const output = execSync(cmd.join(" "));
  const saveTo = output.toString().trim();

  if (!saveTo) {
    await rm(fileForSave, { recursive: true });
    throw new Error("Process cancelled");
  }

  await cp(fileForSave, saveTo, { recursive: true });
};
