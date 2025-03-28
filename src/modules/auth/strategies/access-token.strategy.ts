import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/services/users.service";
import { AccessJwtPayload } from "../types/auth.types";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "access-token") {
	private readonly LOGGER = new Logger(AccessTokenStrategy.name);

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
		this.LOGGER.log("validate", { payload });
		const exists = await this.usersService.checkIfExists(payload.id);
		if (!exists) {
			return null;
		}
		return payload;
	}
}
