import type { CfFile, CfMod } from "@kubejs/core";
import { Injectable } from "@nestjs/common";

import { CurseforgeClientService } from "../curseforge-client/curseforge-client.service";
import type { ModFilesQueryDto } from "./dto/mod-files-query.dto";

@Injectable()
export class ModsService {
  constructor(private readonly __curseforgeClient: CurseforgeClientService) {}

  getMod(modId: number) {
    return this.__curseforgeClient.get<CfMod>(`mods/${modId}`);
  }

  getModFiles(modId: number, { gameVersion, modLoaderType }: ModFilesQueryDto) {
    return this.__curseforgeClient.get<CfFile[]>(`mods/${modId}/files`, {
      gameVersion,
      modLoaderType
    });
  }
}
