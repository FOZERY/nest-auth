import { refresh_sessions } from "@prisma/client";
import { RefreshSession } from "../../../entities/RefreshSession";

export class RefreshSessionsMapper {
	static async toEntity(prismaRefreshSession: refresh_sessions): Promise<RefreshSession> {
		return await RefreshSession.create({
			id: prismaRefreshSession.id,
			userId: prismaRefreshSession.user_id,
			refreshToken: prismaRefreshSession.refresh_token,
			fingerprint: prismaRefreshSession.fingerprint,
			expiresIn: prismaRefreshSession.expires_in,
			ipAddress: prismaRefreshSession.ip_address,
			userAgent: prismaRefreshSession.user_agent,
			createdAt: prismaRefreshSession.created_at,
		});
	}
}
