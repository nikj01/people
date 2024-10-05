import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PeopleModule } from "./people/people.module";
import { AuthenticationModule } from "./auth/authentication.module";

@Module({
  imports: [PeopleModule, AuthenticationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
