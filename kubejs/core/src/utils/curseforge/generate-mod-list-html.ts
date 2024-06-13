import { TemplateGenerateOptions } from "../../types";
import { resolveMods } from "./resolve-mods";

export const generateModListHtml = async (
  modIds: number[],
  options: Pick<TemplateGenerateOptions, "mcVersion" | "modLoaderType">
): Promise<string> => {
  const lines: string[] = [];

  lines.push("<ul>");
  await resolveMods(options.mcVersion, modIds, options.modLoaderType, async mod => {
    lines.push(
      `<li><a href="https://www.curseforge.com/minecraft/mc-mods/${mod.slug}">${mod.name} (by ${mod.authors.map(author => author.name).join(", ")})</a></li>`
    );
  });
  lines.push("</ul>");

  return lines.join("\n");
};
