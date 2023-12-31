import { RequiredModFiles } from "../types/mc/required-mod-files";
import { TemplateGenerateOptions } from "../types/template-generate-options";
import { resolveMods } from "./resolve-mods";

export const generateModListHtml = async (options: TemplateGenerateOptions): Promise<string> => {
  const lines: string[] = [];

  lines.push("<ul>");
  await resolveMods(
    options.mcVersion,
    [RequiredModFiles.KubeJS, RequiredModFiles.ProbeJS],
    !!options.forge,
    async mod => {
      lines.push(
        `<li><a href="https://www.curseforge.com/minecraft/mc-mods/${mod.slug}">${mod.name} (by ${mod.authors[0].name})</a></li>`
      );
    }
  );
  lines.push("</ul>");

  return lines.join("\n");
};
