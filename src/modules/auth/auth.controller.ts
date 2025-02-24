import { Body, Controller, HttpCode, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDTO } from "./dto/register-user.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthenticatedRequest } from "./types/authenticated-request.type";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post("login")
	public async login(@Request() req: AuthenticatedRequest) {
		const token = await this.authService.login(req.user);
		return {
			message: "User successfully logged in.",
			jwt: token,
		};
	}

	@HttpCode(201)
	@Post("register")
	public async register(@Body() dto: RegisterUserDTO) {
		const token = await this.authService.register(dto);

		return {
			message: "User successfully created.",
			jwt: token,
		};
	}

	@Post("refresh-token")
	public async refreshToken() {}
}
