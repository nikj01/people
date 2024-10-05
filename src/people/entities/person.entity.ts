import { Prisma } from "@prisma/client";

export class Person implements Prisma.PersonCreateInput {
  id?: string;
  login: string;
  email: string;
  password: string;
  age: number;
  details: string;
  isDeleted?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;
}
