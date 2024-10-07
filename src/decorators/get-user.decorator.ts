import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetInfoAboutMe = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
