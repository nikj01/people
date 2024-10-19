import { Prisma, Roles } from "@prisma/client";
import { Expose } from "class-transformer";

export class GetSlimPersonDto
  implements
    Omit<
      Prisma.PersonGetPayload<any>,
      "id" | "login" | "password" | "details" | "isDeleted" | "updatedAt" | "deletedAt"
    >
{
  @Expose()
  email: string;
  @Expose()
  age: number;
  @Expose()
  createdAt: Date;
  @Expose()
  roles: Roles[];
}
