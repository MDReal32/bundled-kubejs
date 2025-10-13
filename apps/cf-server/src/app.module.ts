import e from "express";

import { Module, NestMiddleware } from "@nestjs/common";

@Module({
  imports: []
})
export class AppModule implements NestMiddleware {
  use(req: e.Request, res: e.Response, next: e.NextFunction) {
    console.log(req.path);

    next();
  }
}
