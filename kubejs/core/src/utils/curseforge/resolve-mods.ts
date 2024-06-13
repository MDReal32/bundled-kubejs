import { cfFetch } from "../../api";
import { CfFile, CfMod, ModLoaderType } from "../../types";
import { Logger } from "../logger";
import { queue } from "../queue";

type CfFilesWithLatest = CfFile[] & { latest: CfFile };

const cache = new Map<number, { cfMod: CfMod; cfFiles: CfFilesWithLatest }>();

class ModResolver {
  async resolveMods(
    mcVersion: string,
    modIds: number[],
    modLoaderType: ModLoaderType,
    cb: (mod: CfMod, files: CfFilesWithLatest) => Promise<void>
  ) {
    const logger = new Logger("KubeJS Core/ModResolver");

    await queue(modIds, async (modId, queue) => {
      if (!cache.has(modId)) {
        logger.info(`[${modId}] Resolving mod`);
        const { data: cfMod } = await cfFetch<CfMod>(`mods/${modId}`);
        const { data: cfFiles } = await cfFetch<CfFilesWithLatest>(
          `mods/${modId}/files?gameVersion=${mcVersion}&modLoaderType=${modLoaderType}`
        );

        logger.info(`[${modId}] Resolved mod ${cfMod.name}`);
        const latestVersion = cfFiles.find(datum => datum.releaseType === 1);
        if (!latestVersion) return;
        cfFiles.latest = cfFiles.find(datum => datum.id === latestVersion.id)!;
        latestVersion.dependencies.forEach(dependency => queue.push(dependency.modId));

        cache.set(modId, { cfMod, cfFiles });
      }

      const { cfMod, cfFiles } = cache.get(modId)!;
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
  await new ModResolver().resolveMods(mcVersion, modIds, modLoaderType, cb);
};
