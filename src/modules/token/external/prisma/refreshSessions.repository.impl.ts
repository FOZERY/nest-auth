import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../external/persistence/prisma/prisma.service";
import { RefreshSession } from "../../../token/entities/RefreshSession";
import { RefreshSessionsRepository } from "../../repositories/refreshSessions.repository";
import { RefreshSessionsMapper } from "./mappers/refreshSessions.mapper";

@Injectable()
export class RefreshSessionsRepositoryImpl implements RefreshSessionsRepository {
	constructor(private readonly prisma: PrismaService) {}

	public async getRefreshSessionByToken(token: string): Promise<RefreshSession | null> {
		const refreshSession = await this.prisma.refresh_sessions.findUnique({
			where: {
				refresh_token: token,
			},
		});

		if (!refreshSession) {
			return null;
		}

		return await RefreshSessionsMapper.toEntity(refreshSession);
	}

	public async getAllRefreshSessionsByUserIdOrderedByCreatedAtAsc(
		userId: string
	): Promise<RefreshSession[]> {
		const refreshSessions = await this.prisma.refresh_sessions.findMany({
			where: {
				user_id: userId,
			},
			orderBy: {
				created_at: "asc",
			},
		});

		return await Promise.all(
			refreshSessions.map(async (session) => await RefreshSessionsMapper.toEntity(session))
		);
	}

	public async createRefreshSession(session: RefreshSession): Promise<void> {
		await this.prisma.refresh_sessions.create({
			data: {
				user_id: session.userId,
				refresh_token: session.refreshToken,
				fingerprint: session.fingerprint,
				expires_at: session.expiresAt,
				ip_address: session.ipAddress,
				user_agent: session.userAgent,
			},
		});
	}

	public async deleteRefreshSessionByToken(refreshToken: string): Promise<void> {
		// deleteMany чтобы не падала ошибка, если сессии с таким токеном нет
		await this.prisma.refresh_sessions.deleteMany({
			where: { refresh_token: refreshToken },
		});
	}

	public async deleteAllRefreshSessionsByUserId(userId: string): Promise<void> {
		await this.prisma.refresh_sessions.deleteMany({
			where: { user_id: userId },
		});
	}

	public async deleteAllRefreshSessionsByUserIdExceptToken(
		userId: string,
		refreshToken: string
	): Promise<void> {
		await this.prisma.refresh_sessions.deleteMany({
			where: {
				user_id: userId,
				NOT: {
					refresh_token: refreshToken,
				},
			},
		});
	}
}
