import { Body, Controller, Post } from "@nestjs/common";
import { Person } from "../people/entities/person.entity";
import { CreatePersonDto } from "../people/dto/create-person.dto";
import { PeopleService } from "../people/people.service";
import { AuthenticationService, ILoginData } from "./authentication.service";

@Controller("auth")
export class AuthenticationController {
  constructor(
    private readonly peopleService: PeopleService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post("register")
  async register(@Body() createPersonDto: CreatePersonDto): Promise<Person> {
    return await this.peopleService.createPerson(createPersonDto);
  }

  @Post("login")
  async login(@Body() data: ILoginData): Promise<Person> {
    return await this.authenticationService.login(data);
  }
}
