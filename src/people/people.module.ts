import { Module } from "@nestjs/common";
import { PeopleService } from "./people.service";
import { PeopleController } from "./people.controller";
import { PrismaService } from "../prisma.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  controllers: [PeopleController],
  providers: [PrismaService, PeopleService],
})
export class PeopleModule {}
