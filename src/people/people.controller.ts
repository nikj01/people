import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FindPeopleParams, PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { GetInfoAboutMe } from './decorators/get-user.decorator';
import { Person } from '@prisma/client';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  async createPerson(
    @Body() createPersonDto: CreatePersonDto,
  ): Promise<Person> {
    return await this.peopleService.createPerson(createPersonDto);
  }

  @Get()
  async findPeople(@Param() params: FindPeopleParams): Promise<Person[]> {
    return await this.peopleService.findPeople(params);
  }
  @Get(':id')
  async findPersonBy(@Param('id') id: string): Promise<Person> {
    return await this.peopleService.findPerson({ id });
  }

  @Get('/me')
  async aboutMe(@GetInfoAboutMe() person: Person): Promise<Person> {
    return person;
  }

  @Patch(':id')
  async updatePersonBy(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<Person> {
    return await this.peopleService.updatePerson({
      where: { id },
      data: updatePersonDto,
    });
  }

  @Delete(':id')
  async deletePersonBy(@Param('id') id: string): Promise<Person> {
    return await this.peopleService.deletePerson({ id });
  }
}
