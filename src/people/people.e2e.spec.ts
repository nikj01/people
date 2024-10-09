import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import * as request from "supertest";
import * as bcrypt from "bcrypt";
import { Person } from "./entities/person.entity";
import { UpdatePersonDto } from "./dto/update-person.dto";

describe("People (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  let personId: string = "cm20n2te2000098835xyj5ik0";
  const newPerson: Person = {
    age: 20,
    details: "123",
    email: "email@gmail.com",
    login: "login123",
    password: "password123",
  };

  describe("createPerson", () => {
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

    it("should fail if a person with a certain email already exists", async () => {
      const newPersonWithInvalidEmail = JSON.parse(JSON.stringify(newPerson));
      newPersonWithInvalidEmail.login = "login124";

      return request(app.getHttpServer())
        .post("/people")
        .send(newPersonWithInvalidEmail)
        .expect(400)
        .expect(({ body }) => {
          console.log(body);
        });
    });

    it("should fail if a person with a certain login already exists", async () => {
      const newPersonWithInvalidLogin = JSON.parse(JSON.stringify(newPerson));
      newPersonWithInvalidLogin.email = "email1@gmail.com";

      return request(app.getHttpServer())
        .post("/people")
        .send(newPerson)
        .expect(400)
        .expect(({ body }) => {
          console.log(body);
        });
    });
  });

  describe("findPeople", () => {
    it("should return the list of people", () => {
      return request(app.getHttpServer())
        .get("/people")
        .send()
        .expect(200)
        .expect(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body.length).toBeGreaterThanOrEqual(2);
          console.log(body);
        });
    });
  });

  describe("findPersonBy", () => {
    it("should return a person with a certain id", () => {
      return request(app.getHttpServer())
        .get(`/people/${personId}`)
        .send()
        .expect(200)
        .expect(({ body }) => {
          expect(body.email).toEqual(newPerson.email);
          expect(body.age).toEqual(newPerson.age);
          expect(body.details).toEqual(newPerson.details);
          console.log(body);
        });
    });
    it("should fail with invalid id", () => {
      return request(app.getHttpServer())
        .get(`/people/${personId}1`)
        .send()
        .expect(400)
        .expect(({ body }) => {
          console.log(body);
        });
    });
  });

  describe("aboutMe", () => {
    // it("", () => {});
  });

  describe("updatePersonBy", () => {
    const updatedPerson: UpdatePersonDto = {
      age: 50,
      details: "50",
      email: "email50@gmail.com",
      login: "login50",
      password: "password50",
      isDeleted: true,
    };

    it("should update person", () => {});
    return request(app.getHttpServer())
      .patch(`/people/${personId}`)
      .send(updatedPerson)
      .expect(200)
      .expect(({ body }) => {
        console.log(body);
      });
  });
});
