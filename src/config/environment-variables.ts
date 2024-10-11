import { IsNumber, IsString, Max, Min, validateSync } from "class-validator";
import { plainToInstance } from "class-transformer";

export class EnvironmentVariables {
  @IsNumber()
  @Min(1000, { message: "Minimal PORT value is 1000" })
  @Max(65535, { message: "Maximal PORT value is 65535" })
  readonly PORT: number;

  @IsString({ message: "DATABASE_URL must be a string" })
  readonly DATABASE_URL: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: "SALT value must be a number" })
  readonly SALT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
