import { Logger } from "@nestjs/common";

import { loggedUpstreamHeaders } from "../const";

const logger = new Logger("CurseforgeUpstream");
const maxBodyLength = 300;

export const logUpstreamFailure = async (upstreamPath: string, response: Response) => {
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
    `GET ${upstreamPath} failed with ${response.status} ${response.statusText} headers=${JSON.stringify(headers)} body=${JSON.stringify(body.slice(0, maxBodyLength))}`
  );
};
