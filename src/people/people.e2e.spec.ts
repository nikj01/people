import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import * as request from "supertest";
import * as bcrypt from "bcrypt";
import { Person } from "./entities/person.entity";

describe("People (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  let personId: string = "";

  const newPerson: Person = {
    age: 20,
    details: "123",
    email: "email@gmail.com",
    login: "login123",
    password: "password123",
  };

  it("should create a new person", async () => {
    return request(app.getHttpServer())
      .post("/people")
      .send(newPerson)
      .expect(201)
      .expect(({ body }) => {
        expect(body.age).toEqual(newPerson.age);
        expect(body.details).toEqual(newPerson.details);
        expect(body.email).toEqual(newPerson.email);
        expect(body.login).toEqual(newPerson.login);
        expect(bcrypt.compareSync(newPerson.password, body.password)).toBe(true);
        personId = body.id;
        console.log(body);
        console.log(personId);
      });
  });

  it("should return list of people", () => {
    return request(app.getHttpServer())
      .get("/people")
      .send()
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toEqual(1);
        console.log(body);
      });
  });
});
