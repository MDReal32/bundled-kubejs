import { Module } from "@nestjs/common";

import { CfModule } from "./cf/cf.module";
import { MinecraftModule } from "./minecraft/minecraft.module";
import { ModsModule } from "./mods/mods.module";

@Module({
  imports: [CfModule, ModsModule, MinecraftModule]
})
export class AppModule {}
