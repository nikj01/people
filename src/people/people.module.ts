import { Module } from "@nestjs/common";
import { PeopleService } from "./people.service";
import { PeopleController } from "./people.controller";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { getJwtModuleConfig } from "../config/jwt.config";
import { TokenService } from "../token.service";

@Module({
  imports: [ConfigModule, PrismaModule, JwtModule.registerAsync(getJwtModuleConfig())],
  controllers: [PeopleController],
  providers: [PeopleService, TokenService],
  exports: [PeopleService],
})
export class PeopleModule {}
