import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, Query } from "@nestjs/common";
import { IFindPeopleParams, PeopleService } from "./people.service";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";
import { GetJwtToken } from "../decorators/get-jwt-token.decorator";
import { $Enums, Person } from "@prisma/client";
import { GetSlimPersonDto } from "./dto/get-slim-person.dto";
import { plainToInstance } from "class-transformer";
import { GetPersonDto } from "./dto/get-person.dto";
import { AuthenticationGuard } from "../guards/authentication.guard";
import { JwtService } from "@nestjs/jwt";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { Public } from "../decorators/public.decorator";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import {
  AboutMeResponses,
  AdminEndpointResponses,
  CreatePersonResponses,
  DeletePersonResponses,
  FindPeopleResponses,
  FindPersonResponses,
  SoftDeletePersonResponses,
  UpdatePersonResponses,
} from "../swagger/people.endpoints.responses";

@ApiTags("People")
@ApiSecurity("bearerAuth")
@Controller("people")
@UseGuards(AuthenticationGuard, RolesGuard)
export class PeopleController {
  constructor(
    private readonly peopleService: PeopleService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: "Admin only route" })
  @ApiResponse(AdminEndpointResponses.response200)
  @ApiResponse(AdminEndpointResponses.response401)
  @ApiResponse(AdminEndpointResponses.response403)
  @ApiResponse(AdminEndpointResponses.response500)
  @Get("/admin")
  @Roles($Enums.Roles.ADMIN)
  async adminEndpoint() {
    return "This is an admin only route";
  }

  @ApiOperation({ summary: "Creates a new person" })
  @ApiResponse(CreatePersonResponses.response201)
  @ApiResponse(CreatePersonResponses.response400)
  @ApiResponse(CreatePersonResponses.response500)
  @Public()
  @Post()
  async createPerson(@Body() createPersonDto: CreatePersonDto): Promise<Person> {
    return await this.peopleService.createPerson(createPersonDto);
  }

  @ApiOperation({ summary: "Finds people" })
  @ApiResponse(FindPeopleResponses.response200)
  @ApiResponse(FindPeopleResponses.response401)
  @ApiResponse(FindPeopleResponses.response500)
  @ApiQuery({ name: "skip", required: false, type: "number" })
  @ApiQuery({ name: "take", required: false, type: "number" })
  @ApiQuery({ name: "cursor", required: false, type: "string" })
  @ApiQuery({ name: "where", required: false, type: "string" })
  @ApiQuery({ name: "orderBy", required: false, type: "string" })
  @Get()
  async findPeople(@Query() params: IFindPeopleParams): Promise<GetSlimPersonDto[]> {
    return await this.peopleService
      .findPeople(params)
      .then(people =>
        people.map(person => plainToInstance(GetSlimPersonDto, person, { excludeExtraneousValues: true })),
      );
  }

  @ApiOperation({ summary: "Finds the current person" })
  @ApiResponse(AboutMeResponses.response200)
  @ApiResponse(AboutMeResponses.response401)
  @ApiResponse(AboutMeResponses.response500)
  @Get("/me")
  async aboutMe(@GetJwtToken() token: string): Promise<Person> {
    const personId = this.jwtService.decode(token).id;
    return await this.peopleService.findPerson({ id: personId });
  }

  @ApiOperation({ summary: "Finds a person by ID" })
  @ApiResponse(FindPersonResponses.response200)
  @ApiResponse(FindPersonResponses.response400)
  @ApiResponse(FindPersonResponses.response401)
  @ApiResponse(FindPersonResponses.response500)
  @ApiParam({ name: "id", required: true, type: "string" })
  @Get(":id")
  async findPersonBy(@Param("id") id: string): Promise<GetPersonDto> {
    Logger.log(`ID: ${id}`);
    return await this.peopleService
      .findPerson({ id })
      .then(person => plainToInstance(GetPersonDto, person, { excludeExtraneousValues: true }));
  }

  @ApiOperation({ summary: "Updates a person by ID" })
  @ApiResponse(UpdatePersonResponses.response200)
  @ApiResponse(UpdatePersonResponses.response400)
  @ApiResponse(UpdatePersonResponses.response401)
  @ApiResponse(UpdatePersonResponses.response500)
  @ApiParam({ name: "id", required: true, type: "string" })
  @Patch(":id")
  async updatePersonBy(@Param("id") id: string, @Body() updatePersonDto: UpdatePersonDto): Promise<Person> {
    return await this.peopleService.updatePerson({
      where: { id },
      data: updatePersonDto,
    });
  }

  @ApiOperation({ summary: "Soft deletes a person by ID" })
  @ApiResponse(SoftDeletePersonResponses.response200)
  @ApiResponse(SoftDeletePersonResponses.response400)
  @ApiResponse(SoftDeletePersonResponses.response401)
  @ApiResponse(SoftDeletePersonResponses.response403)
  @ApiResponse(SoftDeletePersonResponses.response500)
  @ApiParam({ name: "id", required: true, type: "string" })
  @Delete("/soft/:id")
  @Roles($Enums.Roles.ADMIN)
  async softDeletePersonBy(@Param("id") id: string): Promise<Person> {
    return await this.peopleService.softDeletePerson({ id });
  }

  @ApiOperation({ summary: "Deletes a person by ID" })
  @ApiResponse(DeletePersonResponses.response200)
  @ApiResponse(DeletePersonResponses.response400)
  @ApiResponse(DeletePersonResponses.response401)
  @ApiResponse(DeletePersonResponses.response500)
  @ApiParam({ name: "id", required: true, type: "string" })
  @Delete(":id")
  async deletePersonBy(@Param("id") id: string): Promise<Person> {
    return await this.peopleService.deletePerson({ id });
  }
}
