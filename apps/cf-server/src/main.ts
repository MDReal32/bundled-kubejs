import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { env } from "./env";

const port = env.PORT;
const logger = new Logger("ApplicationBootstrap");

(async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  logger.log(`Server listening on port ${port}`);
})();
