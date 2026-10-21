import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";

import { ModFilesQueryDto } from "./dto/mod-files-query.dto";
import { ModsService } from "./mods.service";

@Controller("v1/mods")
export class ModsController {
  constructor(private readonly __modsService: ModsService) {}

  @Get(":modId")
  getMod(@Param("modId", ParseIntPipe) modId: number) {
    return this.__modsService.getMod(modId);
  }

  @Get(":modId/files")
  getModFiles(@Param("modId", ParseIntPipe) modId: number, @Query() query: ModFilesQueryDto) {
    return this.__modsService.getModFiles(modId, query);
  }
}
