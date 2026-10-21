import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";

import { CurseforgeService } from "./curseforge.service";
import { ModFilesQueryDto } from "./dto/mod-files-query.dto";

@Controller("v1/mods")
export class ModsController {
  constructor(private readonly __curseforgeService: CurseforgeService) {}

  @Get(":modId")
  getMod(@Param("modId", ParseIntPipe) modId: number) {
    return this.__curseforgeService.getMod(modId);
  }

  @Get(":modId/files")
  getModFiles(@Param("modId", ParseIntPipe) modId: number, @Query() query: ModFilesQueryDto) {
    return this.__curseforgeService.getModFiles(modId, query);
  }
}
