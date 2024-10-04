import { Prisma } from '@prisma/client';

export class CreatePersonDto implements Partial<Prisma.PersonCreateInput> {
  login: string;
  email: string;
  password: string;
  age: number;
  details: string;
}
