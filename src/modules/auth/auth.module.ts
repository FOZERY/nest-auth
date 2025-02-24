import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.get<string>("JWT_SECRET"),
					signOptions: { expiresIn: "15m" },
				};
			},
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
