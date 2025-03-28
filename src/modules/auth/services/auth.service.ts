import { ConflictException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { comparePassword } from "../../../common/utils/hash-password";
import { TokenService } from "../../token/services/token.service";
import { UsersService } from "../../users/services/users.service";
import { LoginUserRequestDTO } from "../dto/requests/login-user.request.dto";
import { RegisterUserRequestDTO } from "../dto/requests/register-user.request.dto";
import { RefreshTokenServiceDTO } from "../dto/services/refresh-token.service.dto";
import { AccessRefreshTokens } from "../types/auth.types";

@Injectable()
export class AuthService {
	private LOGGER = new Logger(AuthService.name);

	constructor(
		private readonly usersService: UsersService,
		private readonly tokenService: TokenService
	) {}

	public async login(dto: LoginUserRequestDTO): Promise<AccessRefreshTokens> {
		const user = dto.login
			? await this.usersService.getByLogin(dto.login)
			: await this.usersService.getByEmail(dto.email!);

		if (!user || !(await comparePassword(dto.password, user.password))) {
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

		return await this.tokenService.createAccessRefreshTokens({
			userId: user.id,
			login: user.login,
			email: user.email,
			fingerprint: dto.fingerprint,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});
	}

	public async logout(refreshToken: string): Promise<void> {
		await this.tokenService.deleteRefreshSessionByToken(refreshToken);
	}

	public async logoutAllSessionsExceptCurrent(
		userId: string,
		refreshToken: string
	): Promise<void> {
		await this.tokenService.deleteAllRefreshSessionsByUserIdExceptToken(userId, refreshToken);
	}

	public async register(dto: RegisterUserRequestDTO): Promise<AccessRefreshTokens> {
		const candidateByLogin = await this.usersService.getByLogin(dto.login);

		if (candidateByLogin) {
			throw new ConflictException("Пользователь с таким логином уже существует.");
		}

		const candidateByEmail = await this.usersService.getByEmail(dto.email);

		if (candidateByEmail) {
			throw new ConflictException("Пользователь с таким email уже существует.");
		}

		const user = await this.usersService.create(dto);

		return await this.tokenService.createAccessRefreshTokens({
			userId: user.id,
			login: user.login,
			email: user.email,
			fingerprint: dto.fingerprint,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});
	}

	public async refreshToken(dto: RefreshTokenServiceDTO): Promise<AccessRefreshTokens> {
		// проверяем что такая сессия вообще есть
		const existingSession = await this.tokenService.getRefreshSessionByToken(dto.refreshToken);

		if (!existingSession || existingSession.isExpired()) {
			throw new UnauthorizedException();
		}

		await this.tokenService.deleteRefreshSessionByToken(dto.refreshToken);

		// проверяем что пользователь с такой сессией существует/не удален + данные для access token
		const user = await this.usersService.getById(existingSession.userId);

		if (!user) {
			throw new UnauthorizedException();
		}

		return await this.tokenService.createAccessRefreshTokens({
			userId: user.id,
			login: user.login,
			email: user.email,
			fingerprint: dto.fingerprint,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});
	}
}
