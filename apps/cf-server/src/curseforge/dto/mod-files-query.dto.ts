import { createZodDto } from "nestjs-zod";

import { modFilesQuerySchema } from "../schemas/mod-files-query.schema";

export class ModFilesQueryDto extends createZodDto(modFilesQuerySchema) {}
