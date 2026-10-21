import type { CfFile, CfMod, GameShortVersions } from "@kubejs/core";
import { Injectable } from "@nestjs/common";

import { cfFetch } from "../api";
import type { ModFilesQueryDto } from "./dto/mod-files-query.dto";
import type { ModLoadersQueryDto } from "./dto/mod-loaders-query.dto";
import { buildUpstreamPath } from "./utils/build-upstream-path";
import { toUpstreamHttpException } from "./utils/to-upstream-http-exception";

@Injectable()
export class CurseforgeService {
  getMod(modId: number) {
    return this.__fetchUpstream<CfMod>(`mods/${modId}`);
  }

  getModFiles(modId: number, { gameVersion, modLoaderType }: ModFilesQueryDto) {
    return this.__fetchUpstream<CfFile[]>(
      buildUpstreamPath(`mods/${modId}/files`, { gameVersion, modLoaderType })
    );
  }

  getModLoaders({ version, includeAll }: ModLoadersQueryDto) {
    return this.__fetchUpstream<GameShortVersions[]>(
      buildUpstreamPath("minecraft/modloader", { version, includeAll })
    );
  }

  private async __fetchUpstream<TData>(upstreamPath: string) {
    try {
      return await cfFetch<TData>(upstreamPath);
    } catch (error) {
      throw toUpstreamHttpException(error);
    }
  }
}
