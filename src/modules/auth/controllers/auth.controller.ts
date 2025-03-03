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
import {
	ApiBearerAuth,
	ApiConflictResponse,
	ApiCookieAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import { AccessTokenResponse } from "../../../common/dtos/tokens/access-token.response";
import { RequestWithUser } from "../../../common/types/common.types";
import { setCookieSwaggerHeader } from "../../../external/swagger/set-cookie-header";
import { LoginUserRequestDTO } from "../dto/requests/login-user.request.dto";
import { RefreshTokenRequestDTO } from "../dto/requests/refresh-token.request.dto";
import { RegisterUserRequestDTO } from "../dto/requests/register-user.request.dto";
import { AccessTokenGuard } from "../guards/access-token-auth.guard";
import { AuthService } from "../services/auth.service";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({
		summary: "Аутентификация пользователя",
		description: "Аутентификация пользователя",
	})
	@ApiOkResponse({
		description: "Пользователь успешно аутентифицирован",
		type: AccessTokenResponse,
		headers: {
			...setCookieSwaggerHeader,
		},
	})
	@ApiUnauthorizedResponse({
		description: "Неправильно указан логин/email или пароль",
	})
	@HttpCode(200)
	@Post("login")
	public async login(
		@Body() dto: LoginUserRequestDTO,
		@Res({ passthrough: true }) res: Response
	): Promise<AccessTokenResponse> {
		const { accessToken, refreshSession } = await this.authService.login(dto);

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

	@ApiOperation({
		summary: "Регистрация пользователя",
		description: "Регистрация пользователя",
	})
	@ApiCreatedResponse({
		description: "Пользователь успешно зарегистрирован",
		type: AccessTokenResponse,
		headers: {
			...setCookieSwaggerHeader,
		},
	})
	@ApiConflictResponse({
		description: "Пользователь с таким логином или email уже существует",
	})
	@HttpCode(201)
	@Post("register")
	public async register(
		@Body() dto: RegisterUserRequestDTO,
		@Res({ passthrough: true }) res: Response
	): Promise<AccessTokenResponse> {
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

	@ApiOperation({
		summary: "Выход из системы",
		description:
			"Выход из системы. Удаляет refresh token из базы данных и удаляет куку из браузера. Нужно удалить access на фронте",
	})
	@ApiOkResponse({
		description: "Пользователь успешно разлогинен",
		headers: {
			...setCookieSwaggerHeader,
		},
	})
	@ApiUnauthorizedResponse({
		description: "Refresh token не был предоставлен",
	})
	@ApiCookieAuth()
	@ApiBearerAuth()
	@HttpCode(200)
	@UseGuards(AccessTokenGuard)
	@Post("logout")
	public async logout(
		@Req() req: RequestWithUser,
		@Res({ passthrough: true }) res: Response
	): Promise<void> {
		const refreshToken: string = req.cookies["refreshToken"];

		if (!refreshToken) {
			throw new UnauthorizedException("No refresh token provided");
		}

		await this.authService.logout(refreshToken);

		res.clearCookie("refreshToken");
	}

	@ApiOperation({
		description: "Выход из всех сессий кроме текущей",
		summary: "Выход из всех сессий кроме текущей",
	})
	@ApiOkResponse({
		description: "Успешный выход из сессией",
	})
	@ApiUnauthorizedResponse({
		description: "Refresh token не был предоставлен",
	})
	@ApiBearerAuth()
	@ApiCookieAuth()
	@HttpCode(200)
	@UseGuards(AccessTokenGuard)
	@Post("logout-all-sessions-except-current")
	public async logoutAllSessionsExceptCurrent(@Req() req: RequestWithUser): Promise<void> {
		const refreshToken: string = req.cookies["refreshToken"];

		if (!refreshToken) {
			throw new UnauthorizedException("No refresh token provided");
		}

		await this.authService.logoutAllSessionsExceptCurrent(req.user.id, refreshToken);
	}

	@ApiOperation({
		summary: "Обновление access token",
		description:
			"Обновление access token. При обновлении access token также обновляется refresh token",
	})
	@ApiOkResponse({
		description: "Access token успешно обновлен",
		type: AccessTokenResponse,
		headers: {
			...setCookieSwaggerHeader,
		},
	})
	@ApiUnauthorizedResponse({
		description:
			"Refresh token не был предоставлен, либо истек, либо нет такой сессии, либо пользователь не найден/удален",
	})
	@HttpCode(200)
	@ApiCookieAuth()
	@Post("refresh-token")
	public async refreshToken(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() dto: RefreshTokenRequestDTO
	): Promise<AccessTokenResponse> {
		const refreshToken: string = req.cookies["refreshToken"];

		if (!refreshToken) {
			throw new UnauthorizedException("Refresh token is required");
		}

		const { accessToken, refreshSession } = await this.authService.refreshToken({
			refreshToken,
			fingerprint: dto.fingerprint,
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
}
