import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { ValidationError } from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get("PORT");

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const messages = validationErrors
          .map(error => Object.values(error.constraints))
          .flat()
          .join(". ");

        return new BadRequestException(messages);
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,

      disableErrorMessages: false,

      validationError: {
        value: false,
      },

      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
  Logger.log(`🚀 Application is running on the port ${port}`);
}
bootstrap();
