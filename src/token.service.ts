import { Request } from "express";
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface ICheckTokenData {
  request: Request;
  token: string;
  secret?: string;
}

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}

  extractTokenFromRequest(context: ExecutionContext): ICheckTokenData {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    return { request, token };
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  extractSecretFromConfig(): string {
    return this.configService.get<string>("JWT_SECRET", { infer: true });
  }
}
