import { Body, Controller, Post } from "@nestjs/common";
import { PeopleService } from "../people/people.service";
import { AuthenticationService, ILoginData } from "./authentication.service";

@Controller("auth")
export class AuthenticationController {
  constructor(
    private readonly peopleService: PeopleService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post("login")
  async login(@Body() data: ILoginData): Promise<{ access_token: string }> {
    return await this.authenticationService.login(data);
  }
}
