import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

interface ICheckTokenData {
  request: Request;
  token: string;
  secret?: string;
}

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const data: ICheckTokenData = this.extractTokenFromRequest(context);
    const secret: string = this.extractSecretFromConfig();
    this.checkIsPublic(context, this.reflector);
    return await this.checkToken({ ...data, secret });
  }

  private checkIsPublic(context: ExecutionContext, reflector: Reflector): boolean {
    const isPublic = reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
  }

  private extractTokenFromRequest(context: ExecutionContext): ICheckTokenData {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    return { request, token };
  }

  private extractSecretFromConfig(): string {
    return this.configService.get<string>("JWT_SECRET", { infer: true });
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  private async checkToken(data: ICheckTokenData): Promise<boolean> {
    try {
      data.request["user"] = await this.jwtService.verifyAsync(data.token, {
        secret: data.secret,
      });
    } catch (err) {
      Logger.log("Invalid token");
      Logger.log(err.message);
      throw new UnauthorizedException();
    }
    return true;
  }
}
