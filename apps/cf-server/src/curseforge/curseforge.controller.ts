import type { Request } from "express";

import { Controller, Get, Req } from "@nestjs/common";

import { CurseforgeService } from "./curseforge.service";

@Controller("v1")
export class CurseforgeController {
  constructor(private readonly __curseforgeService: CurseforgeService) {}

  @Get("*")
  proxy(@Req() req: Request) {
    return this.__curseforgeService.fetchUpstream(req.originalUrl);
  }
}
