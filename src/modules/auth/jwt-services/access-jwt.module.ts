import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";

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
		{
			provide: "AccessJwtService",
			useExisting: JwtService,
		},
	],
	exports: ["AccessJwtService"],
})
export class AccessJwtModule {}
