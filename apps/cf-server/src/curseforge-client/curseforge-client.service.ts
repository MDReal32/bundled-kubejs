import type { CfFetchResponse } from "@kubejs/core";
import { HttpException, Injectable } from "@nestjs/common";

import { env } from "../env";
import type { UpstreamQuery } from "./types/upstream-query";
import { buildUpstreamUrl } from "./utils/build-upstream-url";
import { logUpstreamFailure } from "./utils/log-upstream-failure";
import { toUpstreamHttpException } from "./utils/to-upstream-http-exception";

@Injectable()
export class CurseforgeClientService {
  private readonly __cache = new Map<string, CfFetchResponse<unknown>>();

  async get<TData>(path: string, query: UpstreamQuery = {}) {
    const upstreamUrl = buildUpstreamUrl(path, query);
    const cachedResponse = this.__cache.get(upstreamUrl.href);
    if (cachedResponse) {
      return cachedResponse as CfFetchResponse<TData>;
    }

    const data = await this.__fetchUpstream<TData>(upstreamUrl);
    this.__cache.set(upstreamUrl.href, data);
    return data;
  }

  private async __fetchUpstream<TData>(upstreamUrl: URL) {
    try {
      const response = await fetch(upstreamUrl, {
        method: "GET",
        headers: { "x-api-key": env.CURSEFORGE_API_KEY }
      });
      if (!response.ok) {
        await logUpstreamFailure(upstreamUrl, response);
        throw new HttpException(
          `Failed to fetch ${upstreamUrl} with status ${response.status}`,
          response.status
        );
      }

      const data: CfFetchResponse<TData> = await response.json();
      return data;
    } catch (error) {
      throw toUpstreamHttpException(error);
    }
  }
}
