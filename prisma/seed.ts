import { PrismaClient } from "@prisma/client";
import { Person } from "../src/people/entities/person.entity";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const data: Person = {
  age: 20,
  details: "admin",
  email: "admin@gmail.com",
  login: "admin",
  password: bcrypt.hashSync("admin", 2),
};

async function main() {
  await prisma.person.create({ data });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
