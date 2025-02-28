import { Module } from "@nestjs/common";
import { PrismaModule } from "../../external/persistence/prisma/prisma.module";
import { TokenModule } from "../token/token.module";
import { UsersRepositoryImpl } from "./external/prisma/users.repository.impl";
import { PersonalProfileController } from "./profile.controller";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
	imports: [PrismaModule, TokenModule],
	providers: [UsersRepositoryImpl, UsersService],
	controllers: [UsersController, PersonalProfileController],
	exports: [UsersService],
})
export class UsersModule {}
