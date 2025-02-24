import { Module } from "@nestjs/common";
import { PrismaService } from "../../external/persistence/prisma/prisma.service";
import { UsersRepositoryImpl } from "./external/prisma/users.repository.impl";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
	providers: [UsersRepositoryImpl, UsersService, PrismaService],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
