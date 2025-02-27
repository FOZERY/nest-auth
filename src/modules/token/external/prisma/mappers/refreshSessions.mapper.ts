import { refresh_sessions } from "@prisma/client";
import { RefreshSession } from "../../../../token/entities/RefreshSession";

export class RefreshSessionsMapper {
	static async toEntity(prismaRefreshSession: refresh_sessions): Promise<RefreshSession> {
		return await RefreshSession.create({
			id: Number(prismaRefreshSession.id),
			userId: prismaRefreshSession.user_id,
			refreshToken: prismaRefreshSession.refresh_token,
			fingerprint: prismaRefreshSession.fingerprint,
			expiresIn: Number(prismaRefreshSession.expires_in),
			ipAddress: prismaRefreshSession.ip_address,
			userAgent: prismaRefreshSession.user_agent,
			createdAt: prismaRefreshSession.created_at,
		});
	}
}
