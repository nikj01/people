import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const secret = this.configService.get<string>("JWT_SECRET", { infer: true });
    Logger.log(`Token: ${token}`);

    if (!token) {
      Logger.log("No token provided");
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret,
      });
      Logger.log(`secret: this.configService.get<string>("JWT_SECRET", { infer: true }`);
      Logger.log(`Payload: ${JSON.stringify(payload)}`);
      request["user"] = payload;
    } catch (err) {
      Logger.log("Invalid token");
      Logger.log(err.message);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
