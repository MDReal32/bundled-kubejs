import { cfFetch } from "../api/cf-fetch";
import { GameShortVersions } from "../types/mc/game-short-versions";
import { ModLoaderType } from "../types/mod-loader-type";

export const getLatestModloaderForVersion = async (
  version: string,
  modLoaderType: ModLoaderType = ModLoaderType.FORGE
): Promise<string> => {
  const modLoaders = await cfFetch<GameShortVersions[]>(
    `minecraft/modloader?version=${version}&includeAll=true`
  );

  const gameShortVersions = modLoaders.data.sort((a, b) =>
    a.gameVersion.localeCompare(b.gameVersion, undefined, { numeric: true, sensitivity: "base" })
  );

  const latestModLoader =
    gameShortVersions.find(
      modLoader => modLoader.recommended && modLoader.type === modLoaderType
    ) ?? gameShortVersions[gameShortVersions.length - 1];

  return latestModLoader.name;
};
