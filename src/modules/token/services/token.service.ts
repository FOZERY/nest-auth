import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { parseTimeToMilliseconds } from "../../auth/helpers/parseTimeToMilliseconds";
import { CreateAccessTokenServiceDTO } from "../dtos/services/create-access-token.service.dto";
import { CreateRefreshServiceDTO } from "../dtos/services/create-refresh-session.service.dto";
import { RefreshSession } from "../entities/RefreshSession";
import { RefreshSessionsRepositoryImpl } from "../external/prisma/refreshSessions.repository.impl";
import { CreateRefreshSessionResult } from "../interfaces/create-refreshSession-result";
import { RefreshSessionsRepository } from "../repositories/refreshSessions.repository";

export class TokenService {
	constructor(
		private readonly configService: ConfigService,
		private readonly accessJwtService: JwtService,
		@Inject(RefreshSessionsRepositoryImpl)
		private readonly refreshSessionRepository: RefreshSessionsRepository
	) {}

	public async getRefreshSessionByToken(refreshToken: string): Promise<RefreshSession | null> {
		return await this.refreshSessionRepository.getRefreshSessionByToken(refreshToken);
	}

	public async getAllRefreshSessionsByUserId(userId: string): Promise<RefreshSession[]> {
		return await this.refreshSessionRepository.getAllRefreshSessionsByUserIdOrderedByCreatedAtAsc(
			userId
		);
	}

	public async createAccessToken(dto: CreateAccessTokenServiceDTO) {
		return await this.accessJwtService.signAsync({
			id: dto.userId,
			login: dto.login,
			email: dto.email,
		});
	}

	public async createRefreshSession(
		dto: CreateRefreshServiceDTO
	): Promise<CreateRefreshSessionResult> {
		const refreshToken = randomUUID();
		const expiresIn =
			Date.now() +
			parseTimeToMilliseconds(this.configService.get<string>("REFRESH_EXPIRED_IN")!);

		const refreshSession = await RefreshSession.create({
			refreshToken: refreshToken,
			userId: dto.userId,
			userAgent: dto.userAgent,
			fingerprint: dto.fingerprint,
			expiresIn: expiresIn,
			ipAddress: dto.ipAddress,
		});

		await this.refreshSessionRepository.createRefreshSession(refreshSession);

		return {
			refreshToken: refreshSession.refreshToken,
			expiresInSeconds: refreshSession.expiresInSeconds,
		};
	}

	public async deleteRefreshSessionByToken(refreshToken: string): Promise<void> {
		await this.refreshSessionRepository.deleteRefreshSessionByToken(refreshToken);
	}

	public async deleteAllRefreshSessionsByUserId(userId: string): Promise<void> {
		await this.refreshSessionRepository.deleteAllRefreshSessionsByUserId(userId);
	}

	public async deleteAllRefreshSessionsByUserIdExceptToken(userId: string, refreshToken: string) {
		await this.refreshSessionRepository.deleteAllRefreshSessionsByUserIdExceptToken(
			userId,
			refreshToken
		);
	}
}
