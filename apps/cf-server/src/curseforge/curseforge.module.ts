import { Module } from "@nestjs/common";

import { CurseforgeService } from "./curseforge.service";
import { MinecraftController } from "./minecraft.controller";
import { ModsController } from "./mods.controller";

@Module({
  controllers: [ModsController, MinecraftController],
  providers: [CurseforgeService]
})
export class CurseforgeModule {}
