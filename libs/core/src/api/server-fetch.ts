import { posix } from "node:path";

import type { CfFetchResponse } from "../types";

/**
 * Calls go through @kubejs/cf-server, which holds the CurseForge key; CurseForge rejects keyless
 * requests.
 */
const defaultApiUrl: string | undefined = undefined;

const getApiUrl = () => {
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  if (!apiUrl) {
    throw new Error(
      "API_URL is not set. Point it at a running @kubejs/cf-server, e.g. API_URL=http://localhost:3000"
    );
  }

  return apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;
};

const cache = new Map<string, CfFetchResponse<any>>();
export const serverFetch = async <TResponse>(url: string): Promise<CfFetchResponse<TResponse>> => {
  const cachedResponse = cache.get(url);
  if (cachedResponse) return cachedResponse;

  const constructedUrl = new URL(posix.join("v1", url), getApiUrl());
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
