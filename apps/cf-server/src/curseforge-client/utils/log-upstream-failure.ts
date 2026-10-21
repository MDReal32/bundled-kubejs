import { Logger } from "@nestjs/common";

import { loggedUpstreamHeaders, upstreamLogBodyLimit } from "../const";

const logger = new Logger("CurseforgeUpstream");

export const logUpstreamFailure = async (upstreamUrl: URL, response: Response) => {
  const headers: Record<string, string> = {};
  for (const name of loggedUpstreamHeaders) {
    const value = response.headers.get(name);
    if (value) {
      headers[name] = value;
    }
  }

  const body = await response
    .text()
    .catch(error => `<unreadable body: ${error instanceof Error ? error.message : String(error)}>`);

  logger.warn(
    `GET ${upstreamUrl.pathname}${upstreamUrl.search} failed with ${response.status} ${response.statusText} headers=${JSON.stringify(headers)} body=${JSON.stringify(body.slice(0, upstreamLogBodyLimit))}`
  );
};
