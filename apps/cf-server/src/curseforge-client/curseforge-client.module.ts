import { Module } from "@nestjs/common";

import { CurseforgeClientService } from "./curseforge-client.service";

@Module({
  providers: [CurseforgeClientService],
  exports: [CurseforgeClientService]
})
export class CurseforgeClientModule {}
