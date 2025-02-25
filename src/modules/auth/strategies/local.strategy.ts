import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { AuthenticatedRequestUser } from "../types/authenticated-request.type";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: "loginOrEmail",
			passwordField: "password",
		});
	}

	public async validate(
		loginOrEmail: string,
		password: string,
	): Promise<AuthenticatedRequestUser> {
		const user = await this.authService.validateUser(loginOrEmail, password);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
