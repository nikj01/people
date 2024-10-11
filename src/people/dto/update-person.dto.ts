import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { CreatePersonDto } from "./create-person.dto";

export class UpdatePersonDto implements Partial<CreatePersonDto> {
  @IsString()
  @MinLength(5, { message: "The login value is too short. Minimal length is 5" })
  @MaxLength(256, { message: "The login value is too long. Maximal length is 256" })
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsEmail()
  @MaxLength(256, { message: "The email value is too long. Maximal length is 256" })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8, { message: "The password value is too short. Minimal length is 8" })
  @MaxLength(256, { message: "The password value is too long. Maximal length is 256" })
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @Min(13, { message: "The age value is too low. Minimal age is 13" })
  @Max(130, { message: "The age value is too high. Maximal length is 130" })
  @IsNotEmpty()
  age: number;

  @IsString()
  @MinLength(5, { message: "The details value is too short. Minimal length is 5" })
  @MaxLength(1000, { message: "The details value is too long. Maximal length is 1000" })
  @IsNotEmpty()
  details: string;
}
