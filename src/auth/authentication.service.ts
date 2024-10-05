import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Person } from "@prisma/client";
import * as bcrypt from "bcrypt";

export interface ILoginData {
  login: string;
  password: string;
}

@Injectable()
export class AuthenticationService {
  constructor(private readonly prismaService: PrismaService) {}

  async login(data: ILoginData): Promise<Person> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const person = await this.prismaService.person.findUniqueOrThrow({
      where: {
        login: data.login,
      },
    });

    if (await bcrypt.compare(hashedPassword, person.password)) {
      return person;
    } else {
      throw new BadRequestException("Invalid password");
    }
  }
}
