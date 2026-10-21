import { z } from "zod";

import { maxModLoaderTypeId } from "../const";

export const modFilesQuerySchema = z.object({
  gameVersion: z.string().min(1),
  modLoaderType: z.coerce.number().int().min(0).max(maxModLoaderTypeId)
});
