import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "../../external/persistence/prisma/prisma.module";
import { PrismaService } from "../../external/persistence/prisma/prisma.service";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RefreshSessionsRepositoryImpl } from "./external/prisma/refreshSessions.repository.impl";
import { AccessJwtModule } from "./jwt-services/access-jwt.module";
import { RefreshJwtModule } from "./jwt-services/refresh-jwt.module";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
	imports: [PrismaModule, UsersModule, PassportModule, AccessJwtModule, RefreshJwtModule],
	controllers: [AuthController],
	providers: [AuthService, RefreshSessionsRepositoryImpl, LocalStrategy, AccessTokenStrategy],
})
export class AuthModule {}
