import { Prisma } from "@prisma/client";

export class UpdatePersonDto implements Omit<Prisma.PersonUpdateInput, "id" | "login"> {}
