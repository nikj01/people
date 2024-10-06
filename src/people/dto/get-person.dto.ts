import { Prisma } from "@prisma/client";

export class GetPersonDto
  implements Omit<Prisma.PersonGetPayload<any>, "id" | "login" | "password" | "isDeleted" | "updatedAt" | "deletedAt">
{
  email: string;
  age: number;
  details: string;
  createdAt: Date;
}
