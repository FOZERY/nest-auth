import { Controller, Post } from "@nestjs/common";

@Controller("auth")
export class AuthController {
	@Post("login")
	public async login() {}

	@Post("register")
	public async register() {}

	@Post("refresh-token")
	public async refreshToken() {}
}
