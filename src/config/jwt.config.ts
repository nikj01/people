import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions } from "@nestjs/jwt/dist/interfaces/jwt-module-options.interface";

export const getJwtModuleConfig = (): JwtModuleAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => ({
      global: true,
      secret: configService.get<string>("JWT_SECRET", { infer: true }),
      signOptions: { expiresIn: configService.get<string>("JWT_EXPIRES_IN", { infer: true }) },
    }),
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};
