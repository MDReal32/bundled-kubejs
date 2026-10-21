import { join } from "node:path";

import type { CfFetchResponse } from "@kubejs/core";

import { logUpstreamFailure } from "./curseforge/utils/log-upstream-failure";
import { env } from "./env";

const cache = new Map<string, CfFetchResponse<unknown>>();

export const cfFetch = async <TData>(url: string) => {
  const cachedResponse = cache.get(url);
  if (cachedResponse) {
    return cachedResponse as CfFetchResponse<TData>;
  }

  const constructedUrl = new URL(join("v1", url), "https://api.curseforge.com/");
  const response = await fetch(constructedUrl, {
    method: "GET",
    headers: { "x-api-key": env.CURSEFORGE_API_KEY }
  });
  if (!response.ok) {
    await logUpstreamFailure(url, response);
    throw new Error(`Failed to fetch ${constructedUrl} with status ${response.status}`, {
      cause: response
    });
  }

  const data: CfFetchResponse<TData> = await response.json();
  cache.set(url, data);
  return data;
};
