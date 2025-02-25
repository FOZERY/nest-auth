import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthenticatedRequestUser } from "../types/authenticated-request.type";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "access-token") {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>("JWT_SECRET")!,
		});
	}

	async validate(payload: AuthenticatedRequestUser) {
		console.log(payload);
		return payload;
	}
}
