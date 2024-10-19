import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const GetJwtToken = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return extractTokenFromHeader(request);
});

const extractTokenFromHeader = (request: Request): string | undefined => {
  const [type, token] = request.headers.authorization?.split(" ") ?? [];
  return type === "Bearer" ? token : undefined;
};
