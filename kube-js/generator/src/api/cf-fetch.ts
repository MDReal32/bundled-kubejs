import { join } from "node:path";

interface CfFetchResponse<TResponse> {
  data: TResponse;
  pagination: { index: number; pageSize: number; resultCount: number; totalCount: number };
}

const cache = new Map<string, CfFetchResponse<any>>();
export const cfFetch = async <TResponse>(url: string): Promise<CfFetchResponse<TResponse>> => {
  const cachedResponse = cache.get(url);
  if (cachedResponse) return cachedResponse;

  const constructedUrl = new URL(join("v1", url), "http://localhost:8081/");
  return fetch(constructedUrl, { method: "GET" })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch ${constructedUrl} with status ${res.status}`);
      return res.json();
    })
    .then((data: CfFetchResponse<TResponse>) => {
      cache.set(url, data);
      return data;
    });
};
