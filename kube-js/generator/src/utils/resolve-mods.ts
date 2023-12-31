import { cfFetch } from "../api/cf-fetch";
import { CfFile } from "../types/mc/cf-file";
import { CfMod } from "../types/mc/cf-mod";
import { RequiredModFiles } from "../types/mc/required-mod-files";
import { ModLoaderType } from "../types/mod-loader-type";
import { LogActions } from "./logger/log-actions";
import { Logger } from "./logger/logger";
import { queue } from "./queue";

type CfFilesWithLatest = CfFile[] & { latest: CfFile };

@LogActions("ModResolver")
class ModResolver {
  async resolveMods(
    mcVersion: string,
    modIds: RequiredModFiles[],
    modLoaderType: ModLoaderType,
    cb: (mod: CfMod, files: CfFilesWithLatest) => Promise<void>
  ) {
    const logger = new Logger("ModResolver");

    await queue(modIds, async (modId, queue) => {
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
      await cb(cfMod, cfFiles);
    });
  }
}

export const resolveMods = async (
  mcVersion: string,
  modIds: RequiredModFiles[],
  modLoaderType: ModLoaderType = ModLoaderType.FORGE,
  cb: (mod: CfMod, files: CfFilesWithLatest) => Promise<void>
) => {
  await new ModResolver().resolveMods(mcVersion, modIds, modLoaderType, cb);
};
