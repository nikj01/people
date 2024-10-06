import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Person, Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { SALT } from "../constants";

export interface IFindPeopleParams {
  skip?: number;
  take?: number;
  cursor?: Prisma.PersonWhereUniqueInput;
  where?: Prisma.PersonWhereInput;
  orderBy?: Prisma.PersonOrderByWithRelationInput;
}
export interface IUpdatePersonData {
  where: Prisma.PersonWhereUniqueInput;
  data: Prisma.PersonUpdateInput;
}

@Injectable()
export class PeopleService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPerson(data: Prisma.PersonCreateInput): Promise<Person> {
    const hashedPassword = await bcrypt.hash(data.password, SALT);

    return this.prismaService.person.create({
      data: { ...data, password: hashedPassword },
    });
  }

  async findPeople(params: IFindPeopleParams): Promise<Person[]> {
    return this.prismaService.person.findMany(params);
  }

  async findPerson(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    return this.prismaService.person.findUniqueOrThrow({ where });
  }

  async updatePerson(updatedData: IUpdatePersonData): Promise<Person> {
    const hashedPassword = await bcrypt.hash(updatedData.data.password as string, SALT);

    return this.prismaService.person.update({
      where: updatedData.where,
      data: { ...updatedData.data, password: hashedPassword },
    });
  }

  async softDeletePerson(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    return this.prismaService.person.update({ where, data: { isDeleted: true, deletedAt: new Date() } });
  }

  async deletePerson(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    return this.prismaService.person.delete({ where });
  }
}
