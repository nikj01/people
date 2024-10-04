import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  async createPerson(@Body() createPersonDto: CreatePersonDto) {
    return await this.peopleService.createPerson(createPersonDto);
  }

  @Get()
  async findPeople() {
    return await this.peopleService.findPeople();
  }

  @Get(':id')
  async findPerson(@Param('id') id: string) {
    return await this.peopleService.findPerson(+id);
  }

  @Patch(':id')
  async updatePerson(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    return await this.peopleService.updatePerson(+id, updatePersonDto);
  }

  @Delete(':id')
  async deletePerson(@Param('id') id: string) {
    return await this.peopleService.deletePerson(+id);
  }
}
