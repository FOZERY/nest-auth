import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
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
	public async login(
		@Req() req: AuthenticatedRequest,
		@Res({ passthrough: true }) res: Response,
	) {
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

	@Get("refresh-token")
	public async refreshToken(@Req() req: Request) {
		const refreshToken = req.cookies["refresh_token"];
	}
}
