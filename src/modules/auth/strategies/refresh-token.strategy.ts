import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class RefreshTokenStrategy extends PassportStrategy(Strategy, "refresh-token") {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>("JWT_REFRESH_SECRET")!,
		});
	}

	validate(payload: any[]): any {}
}
