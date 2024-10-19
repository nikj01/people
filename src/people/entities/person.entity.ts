import { Prisma, Roles } from "@prisma/client";
import { Expose } from "class-transformer";

export class Person implements Prisma.PersonCreateInput {
  @Expose()
  id?: string;
  @Expose()
  login: string;
  @Expose()
  email: string;
  @Expose()
  password: string;
  @Expose()
  age: number;
  @Expose()
  details: string;
  @Expose()
  isDeleted?: boolean;
  @Expose()
  roles: Roles[];
  @Expose()
  createdAt?: string | Date;
  @Expose()
  updatedAt?: string | Date;
  @Expose()
  deletedAt?: string | Date;
}
