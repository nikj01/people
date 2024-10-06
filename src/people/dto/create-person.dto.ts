import { Prisma } from "@prisma/client";
import { IsEmail, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreatePersonDto implements Partial<Prisma.PersonCreateInput> {
  @IsString()
  @MinLength(5, { message: "Login is too short. Minial length is 5" })
  @MaxLength(256, { message: "Login is too long. Maximal length is 256" })
  login: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: "Password is too short. Minial length is 8" })
  @MaxLength(256, { message: "Password is too long. Maximal length is 256" })
  password: string;

  @IsNumber()
  @Min(13, { message: "Age is too low. Minial age is 13" })
  @Max(130, { message: "Age is too high. Maximal length is 130" })
  age: number;

  @IsString()
  @MinLength(5, { message: "Details is too short. Minial length is 5" })
  @MaxLength(1000, { message: "Details is too long. Maximal length is 1000" })
  details: string;
}
