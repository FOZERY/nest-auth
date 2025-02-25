import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import argon2 from "argon2";
import { randomUUID } from "node:crypto";
import { UsersService } from "../users/users.service";
import { CreateRefreshSessionDTO } from "./dto/create-refresh-session.dto";
import { LoginWithUserPayloadDTO } from "./dto/login-user.dto";
import { RegisterUserDTO } from "./dto/register-user.dto";
import { RefreshSessionsRepositoryImpl } from "./external/prisma/refreshSessions.repository.impl";
import { RefreshSessionsRepository } from "./repositories/refreshSessions.repository";
import { AuthenticatedRequestUser } from "./types/authenticated-request.type";
@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		@Inject(RefreshSessionsRepositoryImpl)
		private readonly refreshSessionRepository: RefreshSessionsRepository,
		@Inject("AccessJwtService") private readonly accessJwtService: JwtService,
	) {}

	public async validateUser(
		loginOrEmail: string,
		password: string,
	): Promise<AuthenticatedRequestUser | null> {
		const user =
			(await this.usersService.findByLogin(loginOrEmail)) ||
			(await this.usersService.findByEmail(loginOrEmail));

		if (!user) {
			return null;
		}

		if (!(await argon2.verify(user.password, password))) {
			return null;
		}

		return {
			id: user.id,
			login: user.login,
			email: user.email,
		};
	}

	public async login(dto: LoginWithUserPayloadDTO) {
		const refreshSession = await this.createRefreshSession({
			userId: dto.id,
			deviceId: dto.deviceId,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});

		return {
			refreshSession: refreshSession,
			accessToken: await this.accessJwtService.signAsync({
				id: dto.id,
				login: dto.login,
				email: dto.email,
			}),
		};
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
			deviceId: dto.deviceId,
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
		const expiresIn = Date.now() + 7 * 24 * 60 * 60 * 1000;
		await this.refreshSessionRepository.createRefreshSession({
			refreshToken: refreshToken,
			userId: dto.userId,
			userAgent: dto.userAgent,
			deviceId: dto.deviceId,
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
