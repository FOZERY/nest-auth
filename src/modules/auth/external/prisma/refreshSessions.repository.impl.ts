import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../external/persistence/prisma/prisma.service";
import { RefreshSession } from "../../interfaces/RefreshSession";
import { RefreshSessionsRepository } from "../../repositories/refreshSessions.repository";

@Injectable()
export class RefreshSessionsRepositoryImpl implements RefreshSessionsRepository {
	constructor(private readonly prisma: PrismaService) {}
	deleteRefreshSessionByToken(refreshToken: string): Promise<void> {
		throw new Error("Method not implemented.");
	}

	public async createRefreshSession(session: RefreshSession): Promise<void> {
		await this.prisma.refresh_sessions.create({
			data: {
				user_id: session.userId,
				refresh_token: session.refreshToken,
				device_id: session.deviceId,
				expires_in: session.expiresIn,
				ip_address: session.ipAddress,
				user_agent: session.userAgent,
			},
		});
	}

	getRefreshSessionById(id: string): Promise<RefreshSession> {
		throw new Error("Method not implemented.");
	}
	getRefreshSessionsByUserId(userId: string): Promise<RefreshSession[]> {
		throw new Error("Method not implemented.");
	}
}
