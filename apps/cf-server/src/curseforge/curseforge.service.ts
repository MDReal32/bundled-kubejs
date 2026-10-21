import { Injectable, NotFoundException } from "@nestjs/common";

import { cfFetch } from "../api";
import { resolveUpstreamPath } from "./utils/resolve-upstream-path";
import { toUpstreamHttpException } from "./utils/to-upstream-http-exception";

@Injectable()
export class CurseforgeService {
  async fetchUpstream(originalUrl: string) {
    const upstreamPath = resolveUpstreamPath(originalUrl);
    if (!upstreamPath) {
      throw new NotFoundException();
    }

    try {
      return await cfFetch(upstreamPath);
    } catch (error) {
      throw toUpstreamHttpException(error);
    }
  }
}
