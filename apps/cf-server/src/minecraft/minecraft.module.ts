import { Module } from "@nestjs/common";

import { CurseforgeClientModule } from "../curseforge-client/curseforge-client.module";
import { MinecraftController } from "./minecraft.controller";
import { MinecraftService } from "./minecraft.service";

@Module({
  imports: [CurseforgeClientModule],
  controllers: [MinecraftController],
  providers: [MinecraftService]
})
export class MinecraftModule {}
