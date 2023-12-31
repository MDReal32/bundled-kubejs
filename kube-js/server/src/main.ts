import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { env } from "./env";

(async () => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("v1");
  await app.listen(env.SERVER_PORT);
})();
