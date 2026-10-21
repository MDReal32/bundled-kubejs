import { cfServerClient } from "../../api";
import { type CfFile, type CfMod, ModLoaderType } from "../../types";
import { Logger } from "../logger";
import { toModLoaderType } from "../minecraft/to-mod-loader-type";
import { queue } from "../queue";
import { selectLatestFile } from "./select-latest-file";

const releaseFileType = 1;
const requiredDependencyRelationType = 3;

type CfFilesWithLatest = CfFile[] & { latest: CfFile };

const cache = new Map<string, { cfMod: CfMod; cfFiles: CfFilesWithLatest }>();

class ModResolver {
  async resolveMods(
    mcVersion: string,
    modIds: number[],
    modLoaderType: ModLoaderType,
    cb: (mod: CfMod, files: CfFilesWithLatest) => Promise<void>
  ) {
    const logger = new Logger("KubeJS Core/ModResolver");

    await queue(modIds, async (modId, queue) => {
      const cacheKey = `${mcVersion}:${modLoaderType}:${modId}`;
      if (!cache.has(cacheKey)) {
        logger.info(`[${modId}] Resolving mod`);
        const { data: cfMod } = await cfServerClient.mods.getMod(modId);
        const { data: cfFiles } = await cfServerClient.mods.getModFiles(modId, {
          gameVersion: mcVersion,
          modLoaderType
        });

        logger.info(`[${modId}] Resolved mod ${cfMod.name}`);
        const latestFile = selectLatestFile(cfFiles, mcVersion);
        if (!latestFile) {
          logger.warn(`[${modId}] ${cfMod.name} has no file for ${mcVersion}, skipping it`);
          return;
        }

        if (latestFile.releaseType !== releaseFileType) {
          logger.warn(
            `[${modId}] ${cfMod.name} has no release file for ${mcVersion}, using ${latestFile.fileName} (release type ${latestFile.releaseType})`
          );
        }

        const cfFilesWithLatest = Object.assign(cfFiles, { latest: latestFile });
        latestFile.dependencies
          .filter(dependency => dependency.relationType === requiredDependencyRelationType)
          .forEach(dependency => {
            queue.push(dependency.modId);
          });

        cache.set(cacheKey, { cfMod, cfFiles: cfFilesWithLatest });
      }

      const { cfMod, cfFiles } = cache.get(cacheKey)!;
      await cb(cfMod, cfFiles);
    });
  }
}

export const resolveMods = async (
  mcVersion: string,
  modIds: number[],
  modLoaderType: ModLoaderType = ModLoaderType.FORGE,
  cb: (mod: CfMod, files: CfFilesWithLatest) => Promise<void>
) => {
  await new ModResolver().resolveMods(mcVersion, modIds, toModLoaderType(modLoaderType), cb);
};
