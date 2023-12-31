import { Controller, Get, Query } from "@nestjs/common";

import { MinecraftService } from "./minecraft.service";

@Controller("minecraft")
export class MinecraftController {
  constructor(private readonly minecraftService: MinecraftService) {}

  @Get("modloader")
  getModLoader(@Query() query = {}) {
    return this.minecraftService.getModLoader(query);
  }
}
