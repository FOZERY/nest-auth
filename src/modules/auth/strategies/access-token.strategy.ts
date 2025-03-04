import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/services/users.service";
import { AccessJwtPayload } from "../types/auth.types";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "access-token") {
	constructor(
		configService: ConfigService,
		private readonly usersService: UsersService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>("JWT_ACCESS_SECRET")!,
		});
	}

	async validate(payload: AccessJwtPayload) {
		// сомнительно, но окэй?? а как еще это сделать? через блэклист + рэдис? хм...
		// удалили пользователя но access остался у него на руках, поэтому + проверка
		// const user = await this.usersService.findById(payload.id);
		// if (!user) {
		// 	return null;
		// }
		return payload;
	}
}
