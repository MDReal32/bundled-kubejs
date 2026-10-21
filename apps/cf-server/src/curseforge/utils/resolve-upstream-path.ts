import { allowedUpstreamPrefixes } from "../const";

const versionPrefix = "/v1/";

/**
 * URL parsing collapses dot segments, including `%2e%2e`, so the allow-list cannot be bypassed
 * with path traversal.
 */
export const resolveUpstreamPath = (originalUrl: string) => {
  const { pathname, search } = new URL(originalUrl, "http://localhost");
  if (!pathname.startsWith(versionPrefix)) {
    return undefined;
  }

  const upstreamPath = pathname.slice(versionPrefix.length);
  if (!allowedUpstreamPrefixes.some(prefix => upstreamPath.startsWith(prefix))) {
    return undefined;
  }

  return `${upstreamPath}${search}`;
};
