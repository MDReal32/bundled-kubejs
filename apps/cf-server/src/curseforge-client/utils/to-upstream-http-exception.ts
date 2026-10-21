import { HttpException, HttpStatus } from "@nestjs/common";

export const toUpstreamHttpException = (error: unknown) => {
  if (error instanceof HttpException) {
    return error;
  }

  const message = error instanceof Error ? error.message : "Upstream request failed";
  return new HttpException(message, HttpStatus.BAD_GATEWAY);
};
