import { Body, Controller, Post } from "@nestjs/common";
import { PeopleService } from "../people/people.service";
import { AuthenticationService, IAccessToken, ILoginData } from "./authentication.service";

@Controller("auth")
export class AuthenticationController {
  constructor(
    private readonly peopleService: PeopleService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post("login")
  async login(@Body() data: ILoginData): Promise<IAccessToken> {
    return await this.authenticationService.login(data);
  }
}
