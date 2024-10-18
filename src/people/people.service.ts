import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Person, Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { PrismaErrorHandler } from "../decorators/prisma-error-handler.decorator";

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
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  private readonly salt = this.configService.get<number>("SALT", { infer: true });

  @PrismaErrorHandler()
  async createPerson(data: Prisma.PersonCreateInput): Promise<Person> {
    const hashedPassword = await bcrypt.hash(data.password, this.salt);
    return this.prismaService.person.create({ data: { ...data, password: hashedPassword } });
  }

  @PrismaErrorHandler()
  async findPeople(params: IFindPeopleParams): Promise<Person[]> {
    return this.prismaService.person.findMany(params);
  }

  @PrismaErrorHandler()
  async findPerson(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    return this.prismaService.person.findUniqueOrThrow({ where });
  }

  @PrismaErrorHandler()
  async updatePerson(updatedData: IUpdatePersonData): Promise<Person> {
    const hashedPassword = await bcrypt.hash(updatedData.data.password as string, this.salt);
    return this.prismaService.person.update({
      where: updatedData.where,
      data: { ...updatedData.data, password: hashedPassword },
    });
  }

  @PrismaErrorHandler()
  async softDeletePerson(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    return this.prismaService.person.update({ where, data: { isDeleted: true, deletedAt: new Date() } });
  }

  @PrismaErrorHandler()
  async deletePerson(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    return this.prismaService.person.delete({ where });
  }
}
