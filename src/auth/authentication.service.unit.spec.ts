import { AuthenticationService, ILoginData } from "./authentication.service";
import { PrismaService } from "../prisma.service";
import { Test } from "@nestjs/testing";
import { Person } from "@prisma/client";
import { BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { SALT } from "../constants";

describe("AuthenticationService", () => {
  let service: AuthenticationService;

  const mockPrismaService = {
    person: {
      findUniqueOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("login", () => {
    const loginData: ILoginData = {
      login: "test",
      password: "password",
    };

    const existingPerson: Person = {
      id: "1",
      login: loginData.login,
      password: loginData.password,
      email: "1@gmail",
      age: 0,
      details: "123",
      isDeleted: false,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
    };

    const error = new BadRequestException("Invalid password");

    const setUpExistingPerson = async () => {
      mockPrismaService.person.findUniqueOrThrow.mockResolvedValue(existingPerson);
      existingPerson.password = await bcrypt.hash(existingPerson.password, SALT);
    };

    it("should return a person", async () => {
      await setUpExistingPerson();

      const result = await service.login(loginData);

      expect(result).toEqual(existingPerson);
    });

    it("should throw an error", async () => {
      await setUpExistingPerson();

      try {
        await service.login({ ...loginData, password: "wrongPassword" });
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });
});
