import { PrismaClient } from "@prisma/client";
import { Person } from "../src/people/entities/person.entity";

const prisma = new PrismaClient();

const data: Person = {
  age: 20,
  details: "admin",
  email: "admin@gmail.com",
  login: "admin",
  password: "admin",
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
