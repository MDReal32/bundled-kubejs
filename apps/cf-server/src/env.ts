import { z } from "zod";

import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  server: {
    CURSEFORGE_API_KEY: z.string(),
    PORT: z.coerce.number().default(3000)
  },
  clientPrefix: "PUBLIC_",
  client: {},
  runtimeEnv: process.env
});
