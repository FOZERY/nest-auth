import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDTO } from "./dto/register-user.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	public async login() {}

	@Post("register")
	public async register(@Body() dto: RegisterUserDTO) {
		console.log(dto);
		await this.authService.register(dto);
		return "created";
	}

	@Post("refresh-token")
	public async refreshToken() {}
}
