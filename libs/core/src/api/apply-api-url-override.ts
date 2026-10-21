import { configureNestBridge } from "nestbridge";

import { cfServerName, defaultApiUrl } from "./const";

export const applyApiUrlOverride = () => {
  const apiUrl = process.env.API_URL;
  if (apiUrl === undefined) {
    return;
  }

  if (!apiUrl) {
    throw new Error(
      `API_URL is empty. Unset it to use ${defaultApiUrl}, or point it at a running @kubejs/cf-server, e.g. API_URL=http://localhost:3000`
    );
  }

  configureNestBridge({ services: { [cfServerName]: apiUrl } });
};
