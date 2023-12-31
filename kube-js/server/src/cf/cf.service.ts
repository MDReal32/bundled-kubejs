import { join } from "node:path/posix";

import { Injectable } from "@nestjs/common";

export interface CfFetchResponse<TResponse> {
  data: TResponse;
  pagination: { index: number; pageSize: number; resultCount: number; totalCount: number };
}

@Injectable()
export class CfService {
  async fetch<TResponse>(url: string) {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("x-api-key", process.env.CURSEFORGE_API_KEY!);

    const constructedUrl = new URL(join("v1", url), "https://api.curseforge.com");
    return fetch(constructedUrl, { method: "GET", headers })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ${constructedUrl} with status ${res.status}`);
        return res.json();
      })
      .then((data: CfFetchResponse<TResponse>) => data);
  }
}
