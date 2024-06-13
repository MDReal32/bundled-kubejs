import { CfFile, CfManifest, CfMod, TemplateGenerateOptions } from "../../types";
import { getLatestModloaderForVersion } from "../minecraft";
import { resolveMods } from "./resolve-mods";

export const manifest = (manifest: CfManifest) => manifest;

export const generateManifest = async (
  modIds: number[],
  options: Pick<TemplateGenerateOptions, "name" | "author" | "mcVersion" | "modLoaderType">
) => {
  const mods: CfMod[] = [];
  const modFiles: Record<string, CfFile> = {};

  await resolveMods(options.mcVersion, modIds, options.modLoaderType, async (mod, files) => {
    mods.push(mod);
    modFiles[mod.id] = files.latest;
  });

  return manifest({
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
  });
};
