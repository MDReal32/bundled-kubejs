import { ZodValidationPipe } from "nestjs-zod";

import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

import { CurseforgeModule } from "./curseforge/curseforge.module";

@Module({
  imports: [CurseforgeModule],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }]
})
export class AppModule {}
