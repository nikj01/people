import { Prisma, Roles } from "@prisma/client";
import { Expose } from "class-transformer";

export class GetPersonDto
  implements
    Omit<Prisma.PersonGetPayload<any>, "id" | "login" | "password" | "isDeleted" | "updatedAt" | "deletedAt">
{
  @Expose()
  email: string;
  @Expose()
  age: number;
  @Expose()
  details: string;
  @Expose()
  createdAt: Date;
  @Expose()
  roles: Roles[];
}
