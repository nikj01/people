import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger } from "@nestjs/common";
import { IFindPeopleParams, PeopleService } from "./people.service";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";
import { GetJwtToken } from "../decorators/get-jwt-token.decorator";
import { Person } from "@prisma/client";
import { GetSlimPersonDto } from "./dto/get-slim-person.dto";
import { plainToInstance } from "class-transformer";
import { GetPersonDto } from "./dto/get-person.dto";
import { AuthenticationGuard } from "../auth/authentication.guard";
import { Public } from "src/decorators/public.decorator";
import { JwtService } from "@nestjs/jwt";

@Controller("people")
@UseGuards(AuthenticationGuard)
export class PeopleController {
  constructor(
    private readonly peopleService: PeopleService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @Public()
  async createPerson(@Body() createPersonDto: CreatePersonDto): Promise<Person> {
    return await this.peopleService.createPerson(createPersonDto);
  }

  @Get()
  // @UseGuards(AuthenticationGuard)
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
  async softDeletePersonBy(@Param("id") id: string): Promise<Person> {
    return await this.peopleService.softDeletePerson({ id });
  }

  @Delete(":id")
  async deletePersonBy(@Param("id") id: string): Promise<Person> {
    return await this.peopleService.deletePerson({ id });
  }
}
