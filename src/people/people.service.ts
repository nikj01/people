import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Person, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface FindPeopleParams {
  skip?: number;
  take?: number;
  cursor?: Prisma.PersonWhereUniqueInput;
  where?: Prisma.PersonWhereInput;
  orderBy?: Prisma.PersonOrderByWithRelationInput;
}
export interface UpdatePersonData {
  where: Prisma.PersonWhereUniqueInput;
  data: Prisma.PersonUpdateInput;
}

@Injectable()
export class PeopleService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPerson(data: Prisma.PersonCreateInput): Promise<Person> {
    const hashedPassword = (data.password = await bcrypt.hash(
      data.password,
      10,
    ));

    return this.prismaService.person.create({
      data: { ...data, password: hashedPassword },
    });
  }

  async findPeople(params: FindPeopleParams): Promise<Person[]> {
    return this.prismaService.person.findMany(params);
  }

  async findPerson(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    return this.prismaService.person.findUniqueOrThrow({ where });
  }

  async updatePerson(updatedData: UpdatePersonData): Promise<Person> {
    const hashedPassword = await bcrypt.hash(
      updatedData.data.password as string,
      10,
    );

    return this.prismaService.person.update({
      where: updatedData.where,
      data: { ...updatedData.data, password: hashedPassword },
    });
  }

  async deletePerson(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    return this.prismaService.person.delete({ where });
  }
}
