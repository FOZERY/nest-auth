import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import argon2 from "argon2";
import { TokenService } from "../token/token.service";
import { UsersService } from "../users/users.service";
import { LoginUserDTO } from "./dto/login-user.dto";
import { RefreshTokenDTO } from "./dto/refresh-token.dto";
import { RegisterUserDTO } from "./dto/register-user.dto";
import { AccessRefreshTokens } from "./types/auth.types";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly tokenService: TokenService
	) {}

	public async login(dto: LoginUserDTO): Promise<AccessRefreshTokens> {
		const user = dto.login
			? await this.usersService.findByLogin(dto.login)
			: await this.usersService.findByEmail(dto.email!);

		if (!user || !(await argon2.verify(user.password, dto.password))) {
			throw new UnauthorizedException("Неправильно указан логин/email или пароль.");
		}

		let userSessions = await this.tokenService.getAllRefreshSessionsByUserId(user.id);

		const sameFingerprintSession = userSessions.find(
			(session) => session.fingerprint === dto.fingerprint
		);

		if (sameFingerprintSession) {
			await this.tokenService.deleteRefreshSessionByToken(
				sameFingerprintSession.refreshToken
			);
			userSessions = userSessions.filter(
				(s) => s.refreshToken !== sameFingerprintSession.refreshToken
			);
		}

		if (userSessions.length >= 5) {
			await this.tokenService.deleteRefreshSessionByToken(userSessions[0].refreshToken);
		}

		return await this.createAccessRefreshTokens({
			userId: user.id,
			login: user.login,
			email: user.email,
			fingerprint: dto.fingerprint,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});
	}

	public async logout(refreshToken: string) {
		await this.tokenService.deleteRefreshSessionByToken(refreshToken);
	}

	public async logoutAllSessionsExceptCurrent(
		userId: string,
		refreshToken: string
	): Promise<void> {
		await this.tokenService.deleteAllRefreshSessionsByUserIdExceptToken(userId, refreshToken);
	}

	// public async logoutAllSessions(refreshToken: string) {
	// 	const session = await this.tokenService.getRefreshSessionByToken(refreshToken);

	// 	await this.tokenService.deleteRefreshSessionByToken(refreshToken);
	// 	await this.tokenService.deleteAllRefreshSessionsByUserId(session.userId);
	// }

	public async register(dto: RegisterUserDTO): Promise<AccessRefreshTokens> {
		const candidateByLogin = await this.usersService.findByLogin(dto.login, true);

		if (candidateByLogin) {
			throw new ConflictException("Пользователь с таким логином уже существует.");
		}

		const candidateByEmail = await this.usersService.findByEmail(dto.email, true);

		if (candidateByEmail) {
			throw new ConflictException("Пользователь с таким email уже существует.");
		}

		const user = await this.usersService.create(dto);

		return await this.createAccessRefreshTokens({
			userId: user.id,
			login: user.login,
			email: user.email,
			fingerprint: dto.fingerprint,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});
	}

	public async refreshToken(
		refreshToken: string,
		dto: RefreshTokenDTO
	): Promise<AccessRefreshTokens> {
		// проверяем что такая сессия вообще есть
		const existingSession = await this.tokenService.getRefreshSessionByToken(refreshToken);

		if (!existingSession || Date.now() > existingSession.expiresIn) {
			throw new UnauthorizedException();
		}

		await this.tokenService.deleteRefreshSessionByToken(refreshToken);

		// проверяем что пользователь с такой сессией существует/не удален + данные для access token
		const user = await this.usersService.findById(existingSession.userId);

		if (!user) {
			throw new UnauthorizedException();
		}

		return await this.createAccessRefreshTokens({
			userId: user.id,
			login: user.login,
			email: user.email,
			fingerprint: dto.fingerprint,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});
	}

	private async createAccessRefreshTokens(dto: {
		userId: string;
		login: string;
		email: string;
		fingerprint: string;
		ipAddress: string;
		userAgent?: string;
	}): Promise<AccessRefreshTokens> {
		const refreshSession = await this.tokenService.createRefreshSession({
			userId: dto.userId,
			fingerprint: dto.fingerprint,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});
		const accessToken = await this.tokenService.createAccessToken({
			userId: dto.userId,
			login: dto.login,
			email: dto.email,
		});

		return {
			accessToken,
			refreshSession,
		};
	}
}
