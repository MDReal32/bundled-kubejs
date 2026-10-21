import { fileURLToPath } from "node:url";

import nestBridge from "nestbridge/vite";

import { cfServerName, defaultApiUrl } from "../src/api/const";

export const cfServerAlias = {
  "@cf-server": fileURLToPath(new URL("../../../apps/cf-server/src", import.meta.url))
};

export const cfServerBridge = () =>
  nestBridge({
    name: cfServerName,
    root: "../../apps/cf-server",
    controllers: "src/**/*.controller.ts",
    baseURL: defaultApiUrl
  });
