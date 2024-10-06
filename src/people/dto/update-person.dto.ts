import { Prisma } from "@prisma/client";

export class UpdatePersonDto implements Partial<Omit<Prisma.PersonCreateInput, "id">> {
  login: string;
  email: string;
  password: string;
  age: number;
  details: string;
  isDeleted: boolean;
}
