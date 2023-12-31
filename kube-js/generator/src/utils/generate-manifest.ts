import { CfManifest } from "../types/cf-manifest";
import { CfFile } from "../types/mc/cf-file";
import { CfMod } from "../types/mc/cf-mod";
import { RequiredModFiles } from "../types/mc/required-mod-files";
import { TemplateGenerateOptions } from "../types/template-generate-options";
import { getLatestModloaderForVersion } from "./get-latest-modloader-for-version";
import { resolveMods } from "./resolve-mods";

export const generateManifest = async (options: TemplateGenerateOptions): Promise<CfManifest> => {
  const mods: CfMod[] = [];
  const modFiles: Record<string, CfFile> = {};

  await resolveMods(
    options.mcVersion,
    [RequiredModFiles.KubeJS, RequiredModFiles.ProbeJS],
    options.modLoaderType,
    async (mod, files) => {
      mods.push(mod);
      modFiles[mod.id] = files.latest;
    }
  );

  return {
    minecraft: {
      version: options.mcVersion,
      modLoaders: [
        {
          id: await getLatestModloaderForVersion(options.mcVersion, options.modLoaderType),
          primary: true
        }
      ]
    },
    manifestType: "minecraftModpack",
    manifestVersion: 1,
    name: options.name,
    author: options.author || "",
    files: mods.map(mod => ({ projectID: mod.id, fileID: modFiles[mod.id].id, required: true })),
    overrides: "overrides"
  };
};
