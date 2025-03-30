import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { RefreshSessionsRepositoryImpl } from "./external/prisma/refreshSessions.repository.impl";
import { RefreshSessionsRedisRepositoryImpl } from "./external/redis/refreshSessions.repository.impl";
import { SessionCleanupService } from "./services/session-cleanup.service";
import { TokenService } from "./services/token.service";

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.get<string>("JWT_ACCESS_SECRET"),
					signOptions: {
						expiresIn: "10m",
					},
				};
			},
			inject: [ConfigService],
		}),
	],
	providers: [
		TokenService,
		SessionCleanupService,
		RefreshSessionsRepositoryImpl,
		RefreshSessionsRedisRepositoryImpl,
	],
	exports: [TokenService],
})
export class TokenModule {}
