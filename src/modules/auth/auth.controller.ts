import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { RequestWithUser } from "../../common/types/common.types";
import { AuthService } from "./auth.service";
import { LoginUserDTO } from "./dto/login-user.dto";
import { LogoutUserDTO } from "./dto/logout-user.dto";
import { RefreshTokenDTO } from "./dto/refresh-token.dto";
import { RegisterUserDTO } from "./dto/register-user.dto";
import { AccessTokenGuard } from "./guards/access-token-auth.guard";
import { AccessTokenResponse } from "./types/auth.types";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(200)
	@Post("login")
	public async login(
		@Body() dto: LoginUserDTO,
		@Res({ passthrough: true }) res: Response
	): Promise<AccessTokenResponse> {
		const { accessToken, refreshSession } = await this.authService.login(dto);

		res.cookie("refreshToken", refreshSession.refreshToken, {
			httpOnly: true,
			maxAge: Math.floor(refreshSession.expiresIn / 1000),

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
		@Res({ passthrough: true }) res: Response
	): Promise<AccessTokenResponse> {
		const { accessToken, refreshSession } = await this.authService.register(dto);

		res.cookie("refreshToken", refreshSession.refreshToken, {
			httpOnly: true,
			maxAge: Math.floor(refreshSession.expiresIn / 1000),
			// sameSite: 'strict',
			// secure:
		});

		return {
			accessToken: accessToken,
		};
	}

	@HttpCode(200)
	@UseGuards(AccessTokenGuard)
	@Post("logout")
	public async logout(
		@Req() req: RequestWithUser,
		@Res({ passthrough: true }) res: Response,
		@Body() dto: LogoutUserDTO // for logging
	): Promise<void> {
		const refreshToken: string = req.cookies["refreshToken"];

		if (!refreshToken) {
			throw new UnauthorizedException("No refresh token provided");
		}

		await this.authService.logout(refreshToken);

		res.clearCookie("refreshToken");
	}

	@HttpCode(200)
	@UseGuards(AccessTokenGuard)
	@Post("logout-all-sessions-except-current")
	public async logoutAllSessionsExceptCurrent(
		@Req() req: RequestWithUser,
		@Res({ passthrough: true }) res: Response,
		@Body() dto: LogoutUserDTO
	): Promise<void> {
		const refreshToken: string = req.cookies["refreshToken"];

		if (!refreshToken) {
			throw new UnauthorizedException("No refresh token provided");
		}

		await this.authService.logoutAllSessionsExceptCurrent(req.user.id, refreshToken);
	}

	@HttpCode(200)
	@Post("refresh-token")
	public async refreshToken(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() dto: RefreshTokenDTO
	): Promise<AccessTokenResponse> {
		const refreshToken: string = req.cookies["refreshToken"];

		if (!refreshToken) {
			throw new UnauthorizedException("Refresh token is required");
		}

		const { accessToken, refreshSession } = await this.authService.refreshToken(
			refreshToken,
			dto
		);

		res.cookie("refreshToken", refreshSession.refreshToken, {
			httpOnly: true,
			maxAge: Math.floor(refreshSession.expiresIn / 1000),
			// sameSite: 'strict',
			// secure:
		});

		return {
			accessToken: accessToken,
		};
	}
}
