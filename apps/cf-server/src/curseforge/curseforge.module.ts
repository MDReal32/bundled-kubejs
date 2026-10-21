import { Module } from "@nestjs/common";

import { CurseforgeController } from "./curseforge.controller";
import { CurseforgeService } from "./curseforge.service";

@Module({
  controllers: [CurseforgeController],
  providers: [CurseforgeService]
})
export class CurseforgeModule {}
