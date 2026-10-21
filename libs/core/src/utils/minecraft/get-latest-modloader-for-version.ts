import { cfServerClient } from "../../api";
import { type GameShortVersions, ModLoaderType } from "../../types";
import { toModLoaderType } from "./to-mod-loader-type";

const compareModLoaderNames = (a: GameShortVersions, b: GameShortVersions) =>
  a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });

export const getLatestModloaderForVersion = async (
  version: string,
  modLoaderType: ModLoaderType = ModLoaderType.FORGE
) => {
  const modLoaders = await cfServerClient.minecraft.getModLoaders({ version, includeAll: true });

  const modLoaderCode = toModLoaderType(modLoaderType);

  const modLoadersOfType = modLoaders.data.filter(modLoader => modLoader.type === modLoaderCode);
  const latestModLoader =
    modLoadersOfType.find(modLoader => modLoader.recommended) ??
    modLoadersOfType.sort(compareModLoaderNames).at(-1);

  if (!latestModLoader) {
    throw new Error(`No ${ModLoaderType[modLoaderCode]} mod loader is listed for ${version}`);
  }

  if (modLoaderCode !== ModLoaderType.FORGE) {
    latestModLoader.name = latestModLoader.name.replace(`-${latestModLoader.gameVersion}`, "");
  }

  return latestModLoader.name;
};
