import { Module } from "@nestjs/common";

import { CfModule } from "../cf/cf.module";
import { MinecraftController } from "./minecraft.controller";
import { MinecraftService } from "./minecraft.service";

@Module({
  imports: [CfModule],
  controllers: [MinecraftController],
  providers: [MinecraftService]
})
export class MinecraftModule {}
