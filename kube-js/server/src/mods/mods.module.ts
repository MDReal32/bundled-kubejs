import { Module, forwardRef } from "@nestjs/common";

import { CfModule } from "../cf/cf.module";
import { ModsController } from "./mods.controller";
import { ModsService } from "./mods.service";

@Module({
  imports: [forwardRef(() => CfModule)],
  controllers: [ModsController],
  providers: [ModsService]
})
export class ModsModule {}
