import { Module } from "@nestjs/common";

import { ModsModule } from "../mods/mods.module";
import { CfService } from "./cf.service";

@Module({
  imports: [ModsModule],
  providers: [CfService],
  exports: [CfService]
})
export class CfModule {}
