import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccessJwtModule } from "./jwt-services/access-jwt.module";
import { RefreshJwtModule } from "./jwt-services/refresh-jwt.module";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
	imports: [UsersModule, PassportModule, AccessJwtModule, RefreshJwtModule],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, AccessTokenStrategy],
})
export class AuthModule {}
