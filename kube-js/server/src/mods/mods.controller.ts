import { Controller, Get, Param, Query } from "@nestjs/common";

import { ModsService } from "./mods.service";

@Controller("mods/:modid")
export class ModsController {
  constructor(private readonly modsService: ModsService) {}

  @Get()
  getMod(@Param("modid") modid: string) {
    return this.modsService.getMod(modid);
  }

  @Get("files")
  async getFiles(@Param("modid") modid: string, @Query() query = {}) {
    return this.modsService.getFiles(modid, query);
  }
}
