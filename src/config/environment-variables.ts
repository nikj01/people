import { IsNotEmpty, IsNumber, IsString, Max, Min, validateSync } from "class-validator";
import { plainToInstance } from "class-transformer";

export class EnvironmentVariables {
  @IsNumber()
  @Min(1000, { message: "Minimal PORT value is 1000" })
  @Max(65535, { message: "Maximal PORT value is 65535" })
  @IsNotEmpty({ message: "PORT is required" })
  readonly PORT: number;

  @IsString({ message: "DATABASE_URL must be a string" })
  @IsNotEmpty({ message: "DATABASE_URL is required" })
  readonly DATABASE_URL: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: "SALT value must be a number" })
  @IsNotEmpty({ message: "SALT is required" })
  readonly SALT: number;

  @IsString({ message: "JWT_SECRET must be a string" })
  @IsNotEmpty({ message: "JWT_SECRET is required" })
  readonly JWT_SECRET: string;

  @IsString({ message: "JWT_EXPIRES_IN must be a string" })
  @IsNotEmpty({ message: "JWT_EXPIRES_IN is required" })
  readonly JWT_EXPIRES_IN: string;

  @IsString({ message: "AUTHENTICATION_STRATEGY must be a string" })
  @IsNotEmpty({ message: "AUTHENTICATION_STRATEGY is required" })
  readonly AUTHENTICATION_STRATEGY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
