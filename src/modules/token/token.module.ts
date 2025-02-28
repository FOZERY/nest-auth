import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../../external/persistence/prisma/prisma.module";
import { RefreshSessionsRepositoryImpl } from "./external/prisma/refreshSessions.repository.impl";
import { TokenService } from "./services/token.service";

@Module({
	imports: [
		PrismaModule,
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
	providers: [TokenService, RefreshSessionsRepositoryImpl],
	exports: [TokenService],
})
export class TokenModule {}
