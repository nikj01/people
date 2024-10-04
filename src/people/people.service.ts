import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Person, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PeopleService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPerson(data: Prisma.PersonCreateInput): Promise<Person> {
    data.password = await bcrypt.hash(data.password, 10);

    return this.prismaService.person.create({ data });
  }

  async findPeople(): Promise<Person[]> {
    return this.prismaService.person.findMany();
  }

  async findPerson(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    return this.prismaService.person.findUniqueOrThrow({ where });
  }

  async updatePerson(
    where: Prisma.PersonWhereUniqueInput,
    data: Prisma.PersonUpdateInput,
  ): Promise<Person> {
    return this.prismaService.person.update({ where, data });
  }

  async deletePerson(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    return this.prismaService.person.delete({ where });
  }
}
