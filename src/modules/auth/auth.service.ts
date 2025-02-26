import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import argon2 from "argon2";
import { randomUUID } from "node:crypto";
import { UsersService } from "../users/users.service";
import { CreateRefreshSessionDTO } from "./dto/create-refresh-session.dto";
import { LoginUserDTO } from "./dto/login-user.dto";
import { RegisterUserDTO } from "./dto/register-user.dto";
import { RefreshSessionsRepositoryImpl } from "./external/prisma/refreshSessions.repository.impl";
import { parseTimeToMilliseconds } from "./helpers/helpers";
import { RefreshSessionsRepository } from "./repositories/refreshSessions.repository";
@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
		@Inject(RefreshSessionsRepositoryImpl)
		private readonly refreshSessionRepository: RefreshSessionsRepository,
		@Inject("AccessJwtService") private readonly accessJwtService: JwtService,
	) {}

	public async login(dto: LoginUserDTO): Promise<{
		accessToken: string;
		refreshSession: {
			refreshToken: string;
			expiresIn: bigint;
		};
	}> {
		const user = dto.login
			? await this.usersService.findByLogin(dto.login)
			: await this.usersService.findByEmail(dto.email!);

		if (!user || !(await argon2.verify(user.password, dto.password))) {
			throw new UnauthorizedException();
		}

		const userSessions =
			await this.refreshSessionRepository.getRefreshSessionsByUserIdOrderedByCreatedAtAsc(
				user.id,
			);

		const sameFingerprintSession = userSessions.find(
			(session) => session.fingerprint === dto.fingerprint,
		);

		if (sameFingerprintSession) {
			await this.refreshSessionRepository.deleteRefreshSessionByToken(
				sameFingerprintSession.refreshToken,
			);
		} else if (userSessions.length >= 5) {
			await this.refreshSessionRepository.deleteRefreshSessionByToken(
				userSessions[0].refreshToken,
			);
		}

		const refreshSession = await this.createRefreshSession({
			userId: user.id,
			fingerprint: dto.fingerprint,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});

		return {
			refreshSession: refreshSession,
			accessToken: await this.accessJwtService.signAsync({
				id: user.id,
				login: user.login,
				email: user.email,
			}),
		};
	}

	public async logout(refreshToken: string) {
		await this.refreshSessionRepository.deleteRefreshSessionByToken(refreshToken);
	}

	public async register(dto: RegisterUserDTO) {
		const candidateByLogin = await this.usersService.findByLogin(dto.login);

		if (candidateByLogin) {
			throw new ConflictException("Пользователь с таким логином уже существует.");
		}

		const candidateByEmail = await this.usersService.findByEmail(dto.email);

		if (candidateByEmail) {
			throw new ConflictException("Пользователь с таким email уже существует.");
		}

		const user = await this.usersService.create(dto);

		const refreshSession = await this.createRefreshSession({
			userId: user.id,
			fingerprint: dto.fingerprint,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});

		return {
			refreshSession,
			accessToken: await this.accessJwtService.signAsync({
				id: user.id,
				login: user.login,
				email: user.email,
			}),
		};
	}

	private async createRefreshSession(dto: CreateRefreshSessionDTO) {
		const refreshToken = randomUUID();
		const expiresIn = BigInt(
			Date.now() +
				parseTimeToMilliseconds(this.configService.get<string>("REFRESH_EXPIRED_IN")!),
		);

		await this.refreshSessionRepository.createRefreshSession({
			refreshToken: refreshToken,
			userId: dto.userId,
			userAgent: dto.userAgent,
			fingerprint: dto.fingerprint,
			expiresIn: expiresIn,
			ipAddress: dto.ipAddress,
			status: "active",
		});

		return {
			refreshToken: refreshToken,
			expiresIn: expiresIn,
		};
	}
}
