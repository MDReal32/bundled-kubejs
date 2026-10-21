import { Controller, Get, Query } from "@nestjs/common";

import { CurseforgeService } from "./curseforge.service";
import { ModLoadersQueryDto } from "./dto/mod-loaders-query.dto";

@Controller("v1/minecraft")
export class MinecraftController {
  constructor(private readonly __curseforgeService: CurseforgeService) {}

  @Get("modloader")
  getModLoaders(@Query() query: ModLoadersQueryDto) {
    return this.__curseforgeService.getModLoaders(query);
  }
}
