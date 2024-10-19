import { ConfigModule, ConfigService } from "@nestjs/config";

export const getPassportModuleConfig = () => {
  return {
    useFactory: (configService: ConfigService) => ({
      defaultStrategy: configService.get<string>("AUTHENTICATION_STRATEGY", { infer: true }),
    }),
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};
