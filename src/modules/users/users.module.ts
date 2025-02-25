import { Module } from "@nestjs/common";
import { PrismaModule } from "../../external/persistence/prisma/prisma.module";
import { UsersRepositoryImpl } from "./external/prisma/users.repository.impl";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
	imports: [PrismaModule],
	providers: [UsersRepositoryImpl, UsersService],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
