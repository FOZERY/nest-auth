import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../external/persistence/prisma/prisma.service";
import { RefreshSession } from "../../interfaces/RefreshSession";
import { RefreshSessionsRepository } from "../../repositories/refreshSessions.repository";

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

		return {
			id: refreshSession.id,
			userId: refreshSession.user_id,
			refreshToken: refreshSession.refresh_token,
			fingerprint: refreshSession.fingerprint,
			expiresIn: refreshSession.expires_in,
			ipAddress: refreshSession.ip_address,
			userAgent: refreshSession.user_agent,
			createdAt: refreshSession.created_at,
			status: refreshSession.status,
		};
	}

	public async getRefreshSessionsByUserIdOrderedByCreatedAtAsc(
		userId: string,
	): Promise<RefreshSession[]> {
		const refreshSessions = await this.prisma.refresh_sessions.findMany({
			where: {
				user_id: userId,
			},
			orderBy: {
				created_at: "asc",
			},
		});

		return refreshSessions.map((session) => ({
			id: session.id,
			userId: session.user_id,
			refreshToken: session.refresh_token,
			fingerprint: session.fingerprint,
			expiresIn: session.expires_in,
			ipAddress: session.ip_address,
			userAgent: session.user_agent,
			createdAt: session.created_at,
			status: session.status,
		}));
	}

	public async deleteRefreshSessionByToken(refreshToken: string): Promise<void> {
		await this.prisma.refresh_sessions.delete({
			where: {
				refresh_token: refreshToken,
			},
		});
	}

	public async createRefreshSession(session: RefreshSession): Promise<void> {
		await this.prisma.refresh_sessions.create({
			data: {
				user_id: session.userId,
				refresh_token: session.refreshToken,
				fingerprint: session.fingerprint,
				expires_in: session.expiresIn,
				ip_address: session.ipAddress,
				user_agent: session.userAgent,
			},
		});
	}
}
