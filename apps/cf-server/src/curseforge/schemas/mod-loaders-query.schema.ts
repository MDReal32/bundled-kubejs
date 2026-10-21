import { z } from "zod";

export const modLoadersQuerySchema = z.object({
  version: z.string().min(1),
  includeAll: z.stringbool()
});
