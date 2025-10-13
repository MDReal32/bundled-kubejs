import { join } from "node:path";

import type { CfFetchResponse } from "../types";

const cache = new Map<string, CfFetchResponse<any>>();
export const serverFetch = async <TResponse>(url: string): Promise<CfFetchResponse<TResponse>> => {
  const cachedResponse = cache.get(url);
  if (cachedResponse) return cachedResponse;

  const constructedUrl = new URL(join("v1", url), "https://api.curseforge.com/");
  return fetch(constructedUrl, { method: "GET" })
    .then(res => {
      if (!res.ok)
        throw new Error(`Failed to fetch ${constructedUrl} with status ${res.status}`, {
          cause: res
        });
      return res.json();
    })
    .then((data: CfFetchResponse<TResponse>) => {
      cache.set(url, data);
      return data;
    });
};
