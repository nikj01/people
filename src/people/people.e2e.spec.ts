import { Test } from "@nestjs/testing";
import { BadRequestException, INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "../app.module";
import * as request from "supertest";
import * as bcrypt from "bcrypt";
import { HttpExceptionFilter } from "../filters/http-exception.filter";
import { ValidationError } from "class-validator";

describe("People (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          const messages = validationErrors
            .map(error => Object.values(error.constraints))
            .flat()
            .join(". ");

          return new BadRequestException(messages);
        },
        transform: true,
      }),

      // new ValidationPipe({
      //   exceptionFactory: (validationErrors: ValidationError[] = []) => {
      //     console.error(JSON.stringify(validationErrors));
      //     return new BadRequestException(validationErrors);
      //   },
      //   transform: true,
      // }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  let personId: string = "cm20n2te2000098835xyj5ik0";
  const newPerson = {
    age: 20,
    details: "1234",
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

    it("should fail because of invalid login", async () => {
      const newPersonWithInvalidLogin = JSON.parse(JSON.stringify(newPerson));
      newPersonWithInvalidLogin.login = "1";

      return request(app.getHttpServer())
        .post("/people")
        .send(newPersonWithInvalidLogin)
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

  // describe("aboutMe", () => {
  //   it("", () => {});
  // });

  describe("updatePersonBy", () => {
    const updatedPerson = {
      age: 50,
      details: "5050505050",
      email: "email50@gmail.com",
      login: "login50",
      password: "password50",
    };

    it("should update person", () => {
      return request(app.getHttpServer())
        .patch(`/people/${personId}`)
        .send(updatedPerson)
        .expect(200)
        .expect(({ body }) => {
          expect(body.age).toEqual(updatedPerson.age);
          expect(body.details).toEqual(updatedPerson.details);
          expect(body.email).toEqual(updatedPerson.email);
          expect(body.login).toEqual(updatedPerson.login);
          expect(bcrypt.compareSync(updatedPerson.password, body.password)).toBe(true);
          console.log(body);
        });
    });

    it("should fail with invalid login", () => {
      updatedPerson.login = "1";
      return request(app.getHttpServer())
        .patch(`/people/${personId}`)
        .send(updatedPerson)
        .expect(400)
        .expect(({ body }) => {
          // expect(body.age).toEqual(updatedPerson.age);
          // expect(body.details).toEqual(updatedPerson.details);
          // expect(body.email).toEqual(updatedPerson.email);
          // expect(body.login).toEqual(updatedPerson.login);
          // expect(bcrypt.compareSync(updatedPerson.password, body.password)).toBe(true);
          console.log(body);
        });
    });
  });
});
