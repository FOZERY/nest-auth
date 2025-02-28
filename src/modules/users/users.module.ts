import { Module } from "@nestjs/common";
import { PrismaModule } from "../../external/persistence/prisma/prisma.module";
import { TokenModule } from "../token/token.module";
import { PersonalProfileController } from "./controllers/personal-profile.controller";
import { UsersController } from "./controllers/users.controller";
import { UsersRepositoryImpl } from "./external/prisma/users.repository.impl";
import { UsersService } from "./services/users.service";

@Module({
	imports: [PrismaModule, TokenModule],
	providers: [UsersRepositoryImpl, UsersService],
	controllers: [UsersController, PersonalProfileController],
	exports: [UsersService],
})
export class UsersModule {}
