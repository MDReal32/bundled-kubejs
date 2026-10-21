import { HttpException, HttpStatus } from "@nestjs/common";

export const toUpstreamHttpException = (error: unknown) => {
  if (!(error instanceof Error)) {
    return new HttpException("Upstream request failed", HttpStatus.BAD_GATEWAY);
  }

  const status = error.cause instanceof Response ? error.cause.status : HttpStatus.BAD_GATEWAY;
  return new HttpException(error.message, status);
};
