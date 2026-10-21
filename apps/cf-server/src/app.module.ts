import { ZodValidationPipe } from "nestjs-zod";

import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

import { MinecraftModule } from "./minecraft/minecraft.module";
import { ModsModule } from "./mods/mods.module";

@Module({
  imports: [ModsModule, MinecraftModule],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }]
})
export class AppModule {}
