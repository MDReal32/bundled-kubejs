import { Module } from "@nestjs/common";

import { CurseforgeModule } from "./curseforge/curseforge.module";

@Module({
  imports: [CurseforgeModule]
})
export class AppModule {}
