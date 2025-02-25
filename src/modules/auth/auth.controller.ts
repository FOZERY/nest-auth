import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginUserDTO } from "./dto/login-user.dto";
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
		@Body() dto: LoginUserDTO,
		@Req() req: AuthenticatedRequest,
		@Res({ passthrough: true }) res: Response,
	) {
		const { accessToken, refreshSession } = await this.authService.login({
			id: req.user.id,
			email: req.user.email,
			login: req.user.login,
			deviceId: dto.deviceId,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});

		res.cookie("refreshToken", refreshSession.refreshToken, {
			httpOnly: true,
			maxAge: refreshSession.expiresIn,
			// sameSite: 'strict',
			// secure:
		});

		return {
			accessToken: accessToken,
		};
	}

	@HttpCode(201)
	@Post("register")
	public async register(@Body() dto: RegisterUserDTO, @Res({ passthrough: true }) res: Response) {
		const { accessToken, refreshSession } = await this.authService.register(dto);

		res.cookie("refreshToken", refreshSession.refreshToken, {
			httpOnly: true,
			maxAge: refreshSession.expiresIn,
			// sameSite: 'strict',
			// secure:
		});

		return {
			accessToken: accessToken,
		};
	}

	@Get("refresh-token")
	public async refreshToken(@Req() req: Request) {
		const refreshToken = req.cookies["refresh_token"];
	}
}
