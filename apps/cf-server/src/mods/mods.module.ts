import { Module } from "@nestjs/common";

import { CurseforgeClientModule } from "../curseforge-client/curseforge-client.module";
import { ModsController } from "./mods.controller";
import { ModsService } from "./mods.service";

@Module({
  imports: [CurseforgeClientModule],
  controllers: [ModsController],
  providers: [ModsService]
})
export class ModsModule {}
