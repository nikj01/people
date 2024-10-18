import { Module } from "@nestjs/common";
import { PeopleService } from "./people.service";
import { PeopleController } from "./people.controller";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { getJwtModuleConfig } from "../config/jwt.config";

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    // PassportModule.register(getPassportModuleConfig()),
    JwtModule.registerAsync(getJwtModuleConfig()),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
