import { createZodDto } from "nestjs-zod";

import { modLoadersQuerySchema } from "../schemas/mod-loaders-query.schema";

export class ModLoadersQueryDto extends createZodDto(modLoadersQuerySchema) {}
