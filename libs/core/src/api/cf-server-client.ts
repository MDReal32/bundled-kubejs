import { MinecraftController } from "@cf-server/minecraft/minecraft.controller";
import { ModsController } from "@cf-server/mods/mods.controller";

import { applyApiUrlOverride } from "./apply-api-url-override";

applyApiUrlOverride();

export const cfServerClient = {
  mods: new ModsController(),
  minecraft: new MinecraftController()
};
