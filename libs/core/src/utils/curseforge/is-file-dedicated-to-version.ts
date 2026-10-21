import type { CfFile } from "../../types";

const minecraftReleaseVersion = /^\d+\.\d+(\.\d+)?$/;

const getMinorLine = (version: string) => version.split(".").slice(0, 2).join(".");

/**
 * CurseForge tags a file with every Minecraft version it was uploaded for, and mod authors tag a
 * build for the whole minor line even when it is compiled against one patch release, e.g. KubeJS
 * 2101.7.2 is tagged 1.21 and 1.21.1 but needs NeoForge 21.1. A file that carries no other tag from
 * the target's minor line is the one built for exactly that version.
 */
export const isFileDedicatedToVersion = (file: CfFile, mcVersion: string) => {
  const targetLine = getMinorLine(mcVersion);

  return file.gameVersions
    .filter(version => minecraftReleaseVersion.test(version) && version !== mcVersion)
    .every(version => getMinorLine(version) !== targetLine);
};
