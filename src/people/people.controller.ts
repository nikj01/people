import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger } from "@nestjs/common";
import { IFindPeopleParams, PeopleService } from "./people.service";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";
import { GetJwtToken } from "../decorators/get-jwt-token.decorator";
import { $Enums, Person } from "@prisma/client";
import { GetSlimPersonDto } from "./dto/get-slim-person.dto";
import { plainToInstance } from "class-transformer";
import { GetPersonDto } from "./dto/get-person.dto";
import { AuthenticationGuard } from "../guards/authentication.guard";
import { JwtService } from "@nestjs/jwt";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { Public } from "../decorators/public.decorator";

@Controller("people")
@UseGuards(AuthenticationGuard, RolesGuard)
export class PeopleController {
  constructor(
    private readonly peopleService: PeopleService,
    private readonly jwtService: JwtService,
  ) {}

  @Get("/admin")
  @Roles($Enums.Roles.ADMIN)
  async adminEndpoint() {
    return "This is an admin only route";
  }

  @Public()
  @Post()
  async createPerson(@Body() createPersonDto: CreatePersonDto): Promise<Person> {
    return await this.peopleService.createPerson(createPersonDto);
  }

  @Get()
  async findPeople(@Param() params: IFindPeopleParams): Promise<GetSlimPersonDto[]> {
    return await this.peopleService
      .findPeople(params)
      .then(people =>
        people.map(person => plainToInstance(GetSlimPersonDto, person, { excludeExtraneousValues: true })),
      );
  }

  @Get("/me")
  async aboutMe(@GetJwtToken() token: string): Promise<Person> {
    const personId = this.jwtService.decode(token).id;
    return await this.peopleService.findPerson({ id: personId });
  }

  @Get(":id")
  async findPersonBy(@Param("id") id: string): Promise<GetPersonDto> {
    Logger.log(`ID: ${id}`);
    return await this.peopleService
      .findPerson({ id })
      .then(person => plainToInstance(GetPersonDto, person, { excludeExtraneousValues: true }));
  }

  @Patch(":id")
  async updatePersonBy(@Param("id") id: string, @Body() updatePersonDto: UpdatePersonDto): Promise<Person> {
    return await this.peopleService.updatePerson({
      where: { id },
      data: updatePersonDto,
    });
  }

  @Delete("/soft/:id")
  @Roles($Enums.Roles.ADMIN)
  async softDeletePersonBy(@Param("id") id: string): Promise<Person> {
    return await this.peopleService.softDeletePerson({ id });
  }

  @Delete(":id")
  async deletePersonBy(@Param("id") id: string): Promise<Person> {
    return await this.peopleService.deletePerson({ id });
  }
}
