import { AuthenticationController } from "./authentication.controller";
import { Module } from "@nestjs/common";
import { PeopleService } from "../people/people.service";
import { AuthenticationService } from "./authentication.service";
import { PrismaService } from "../prisma.service";

@Module({
  controllers: [AuthenticationController],
  providers: [PrismaService, PeopleService, AuthenticationService],
})
export class AuthenticationModule {}
