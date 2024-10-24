import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { SwaggerModule } from "@nestjs/swagger";
import { getDocumentFactory } from "./config/swagger.config";
import { ValidationPipeConfig } from "./config/validation-pipe.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get("PORT");

  app.useGlobalPipes(new ValidationPipe(ValidationPipeConfig));
  app.useGlobalFilters(new HttpExceptionFilter());

  SwaggerModule.setup("swagger", app, getDocumentFactory(app), {
    jsonDocumentUrl: "swagger/json",
  });

  await app.listen(port);
  Logger.log(`🚀 Application is running on the port ${port}`);
}
bootstrap();
