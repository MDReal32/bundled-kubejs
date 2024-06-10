import { join } from "node:path";

interface CfFetchResponse<TResponse> {
  data: TResponse;
  pagination: { index: number; pageSize: number; resultCount: number; totalCount: number };
}

const cache = new Map<string, CfFetchResponse<any>>();
export const cfFetch = async <TResponse>(url: string): Promise<CfFetchResponse<TResponse>> => {
  const cachedResponse = cache.get(url);
  if (cachedResponse) return cachedResponse;

  const constructedUrl = new URL(join("v1", url), "https://api.curseforge.com/");
  return fetch(constructedUrl, {
    method: "GET",
    headers: {
      "x-api-key": "$2a$10$hdMofUaafT.AaGXI8ZugF.XChrSwlQ1.Br.9YxM7BYTppSfmnuFMe"
    }
  })
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
