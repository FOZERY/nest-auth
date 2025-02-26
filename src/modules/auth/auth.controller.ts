import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginUserDTO } from "./dto/login-user.dto";
import { LogoutUserDTO } from "./dto/logout-user.dto";
import { RegisterUserDTO } from "./dto/register-user.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(200)
	@Post("login")
	public async login(@Body() dto: LoginUserDTO, @Res({ passthrough: true }) res: Response) {
		const { accessToken, refreshSession } = await this.authService.login({
			login: dto.login,
			email: dto.email,
			password: dto.password,
			fingerprint: dto.fingerprint,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});

		res.cookie("refreshToken", refreshSession.refreshToken, {
			httpOnly: true,
			maxAge: Math.floor(Number(refreshSession.expiresIn) / 1000),

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
			maxAge: Number(refreshSession.expiresIn),
			// sameSite: 'strict',
			// secure:
		});

		return {
			accessToken: accessToken,
		};
	}

	@HttpCode(200)
	@Post("logout")
	public async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() dto: LogoutUserDTO, // for logging
	) {
		const refreshToken = req.cookies["refreshToken"];

		if (!refreshToken) {
			throw new BadRequestException("No refresh token provided");
		}

		await this.authService.logout(refreshToken);

		res.clearCookie("refreshToken");
	}

	@Get("refresh-token")
	public async refreshToken(@Req() req: Request) {}
}
