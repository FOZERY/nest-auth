import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "access-token") {
	constructor(
		configService: ConfigService,
		private readonly usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>("JWT_ACCESS_SECRET")!,
			passReqToCallback: true,
		});
	}

	async validate(payload: any) {
		const user = await this.usersService.findById(payload.id);
		if (!user) {
			return null;
		}
		return payload;
	}
}
