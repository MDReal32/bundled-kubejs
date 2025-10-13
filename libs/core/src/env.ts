import { z } from "zod";

import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  server: {
    API_URL: z.url()
  },
  clientPrefix: "PUBLIC_",
  client: {},
  runtimeEnv: process.env
});
