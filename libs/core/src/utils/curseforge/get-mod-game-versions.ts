import { cfServerClient } from "../../api";

export const getModGameVersions = async (modId: number) => {
  const { data: cfMod } = await cfServerClient.mods.getMod(modId);
  return Array.from(new Set(cfMod.latestFilesIndexes.map(file => file.gameVersion)));
};
