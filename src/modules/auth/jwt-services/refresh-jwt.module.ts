import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.get<string>("JWT_REFRESH_SECRET"),
					signOptions: {
						expiresIn: "7d",
					},
				};
			},
			inject: [ConfigService],
		}),
	],
	providers: [
		{
			provide: "RefreshJwtService",
			useExisting: JwtService,
		},
	],
	exports: ["RefreshJwtService"],
})
export class RefreshJwtModule {}
