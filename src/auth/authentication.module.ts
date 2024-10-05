import { AuthenticationController } from "./authentication.controller";
import { Module } from "@nestjs/common";
import { PeopleService } from "../people/people.service";
import { AuthenticationService } from "./authentication.service";

@Module({
  controllers: [AuthenticationController],
  providers: [PeopleService, AuthenticationService],
})
export class AuthenticationModule {}
