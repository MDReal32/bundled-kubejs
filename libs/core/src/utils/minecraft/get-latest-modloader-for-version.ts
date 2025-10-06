import { cfFetch } from "../../api";
import { type GameShortVersions, ModLoaderType } from "../../types";

const fixName = (name: string) => name.toUpperCase() as any as ModLoaderType;

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
  const modLoaderCode = (
    typeof modLoaderType === "number" ? modLoaderType : ModLoaderType[fixName(modLoaderType)]
  ) as ModLoaderType;

  const latestModLoader =
    gameShortVersions.find(
      modLoader => modLoader.recommended && modLoader.type === modLoaderCode
    ) ?? gameShortVersions[gameShortVersions.length - 1];

  if (modLoaderCode !== ModLoaderType.FORGE) {
    latestModLoader.name = latestModLoader.name.replace(`-${latestModLoader.gameVersion}`, "");
  }

  return latestModLoader.name;
};
