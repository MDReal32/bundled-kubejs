import { upstreamBaseUrl } from "../const";
import type { UpstreamQuery } from "../types/upstream-query";

export const buildUpstreamUrl = (path: string, query: UpstreamQuery) => {
  const upstreamUrl = new URL(path, upstreamBaseUrl);
  for (const [name, value] of Object.entries(query)) {
    upstreamUrl.searchParams.set(name, String(value));
  }

  return upstreamUrl;
};
