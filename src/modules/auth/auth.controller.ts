import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginUserDTO } from "./dto/login-user.dto";
import { LogoutUserDTO } from "./dto/logout-user.dto";
import { RefreshTokenDTO } from "./dto/refresh-token.dto";
import { RegisterUserDTO } from "./dto/register-user.dto";
import { AccessTokenResponse } from "./types/auth.types";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(200)
	@Post("login")
	public async login(
		@Body() dto: LoginUserDTO,
		@Res({ passthrough: true }) res: Response,
	): Promise<AccessTokenResponse> {
		const { accessToken, refreshSession } = await this.authService.login(dto);

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
	public async register(
		@Body() dto: RegisterUserDTO,
		@Res({ passthrough: true }) res: Response,
	): Promise<AccessTokenResponse> {
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
	): Promise<void> {
		const refreshToken: string = req.cookies["refreshToken"];

		if (!refreshToken) {
			throw new BadRequestException("No refresh token provided");
		}

		await this.authService.logout(refreshToken);

		res.clearCookie("refreshToken");
	}

	@HttpCode(200)
	@Post("refresh-token")
	public async refreshToken(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() dto: RefreshTokenDTO,
	): Promise<AccessTokenResponse> {
		const refreshToken: string = req.cookies["refreshToken"];

		if (!refreshToken) {
			throw new UnauthorizedException("No refresh token provided");
		}

		const { accessToken, refreshSession } = await this.authService.refreshToken(
			refreshToken,
			dto,
		);

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
}
