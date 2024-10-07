import { Prisma } from "@prisma/client";

export class GetSlimPersonDto
  implements
    Omit<
      Prisma.PersonGetPayload<any>,
      "id" | "login" | "password" | "details" | "isDeleted" | "updatedAt" | "deletedAt"
    >
{
  email: string;
  age: number;
  createdAt: Date;
}
