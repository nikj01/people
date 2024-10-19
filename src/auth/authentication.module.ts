import { AuthenticationController } from "./authentication.controller";
import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { getJwtModuleConfig } from "src/config/jwt.config";
import { PeopleModule } from "../people/people.module";

@Module({
  imports: [ConfigModule, PassportModule, JwtModule.registerAsync(getJwtModuleConfig()), PeopleModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
