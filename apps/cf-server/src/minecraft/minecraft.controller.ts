import { Controller, Get, Query } from "@nestjs/common";

import { ModLoadersQueryDto } from "./dto/mod-loaders-query.dto";
import { MinecraftService } from "./minecraft.service";

@Controller("v1/minecraft")
export class MinecraftController {
  constructor(private readonly __minecraftService: MinecraftService) {}

  @Get("modloader")
  getModLoaders(@Query() query: ModLoadersQueryDto) {
    return this.__minecraftService.getModLoaders(query);
  }
}
