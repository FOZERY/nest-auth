import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InvalidTokenError } from "../../../core/errors/auth.errors";

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) {}

	public async validateTokenAsync(token: string) {
		try {
			const payload = await this.jwtService.verifyAsync(token);
			return payload;
		} catch (error) {
			throw new InvalidTokenError("Invalid token", { cause: error });
		}
	}

	public validateToken(token: string) {
		try {
			const payload = this.jwtService.verify(token);
			return payload;
		} catch (error) {
			throw new InvalidTokenError("Invalid token", { cause: error });
		}
	}
}
