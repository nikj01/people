import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { IFindPeopleParams, PeopleService } from "./people.service";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";
import { GetInfoAboutMe } from "../decorators/get-user.decorator";
import { Person } from "@prisma/client";
import { GetSlimPersonDto } from "./dto/get-slim-person.dto";
import { plainToInstance } from "class-transformer";
import { GetPersonDto } from "./dto/get-person.dto";

@Controller("people")
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

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

  @Get(":id")
  async findPersonBy(@Param("id") id: string): Promise<GetPersonDto> {
    return await this.peopleService
      .findPerson({ id })
      .then(person => plainToInstance(GetPersonDto, person, { excludeExtraneousValues: true }));
  }

  @Get("/me")
  async aboutMe(@GetInfoAboutMe() person: Person): Promise<Person> {
    return person;
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
