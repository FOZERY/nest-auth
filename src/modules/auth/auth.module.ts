import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.get<string>("JWT_SECRET"),
					signOptions: { expiresIn: "10m" },
				};
			},
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, AccessTokenStrategy],
})
export class AuthModule {}
