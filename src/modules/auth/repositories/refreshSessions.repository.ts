import { RefreshSession } from "../interfaces/RefreshSession";

export interface RefreshSessionsRepository {
	createRefreshSession(session: RefreshSession): Promise<void>;

	deleteRefreshSessionByToken(refreshToken: string): Promise<void>;

	getRefreshSessionByToken(token: string): Promise<RefreshSession | null>;

	getRefreshSessionsByUserIdOrderedByCreatedAtAsc(userId: string): Promise<RefreshSession[]>;
}
