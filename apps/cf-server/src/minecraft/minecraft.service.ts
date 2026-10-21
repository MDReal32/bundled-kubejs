import type { GameShortVersions } from "@kubejs/core";
import { Injectable } from "@nestjs/common";

import { CurseforgeClientService } from "../curseforge-client/curseforge-client.service";
import type { ModLoadersQueryDto } from "./dto/mod-loaders-query.dto";

@Injectable()
export class MinecraftService {
  constructor(private readonly __curseforgeClient: CurseforgeClientService) {}

  getModLoaders({ version, includeAll }: ModLoadersQueryDto) {
    return this.__curseforgeClient.get<GameShortVersions[]>("minecraft/modloader", {
      version,
      includeAll
    });
  }
}
