import { RefreshSession } from "../interfaces/RefreshSession";

export interface RefreshSessionsRepository {
	createRefreshSession(session: RefreshSession): Promise<void>;

	deleteRefreshSessionByToken(refreshToken: string): Promise<void>;

	getRefreshSessionById(id: string): Promise<RefreshSession>;

	getRefreshSessionsByUserId(userId: string): Promise<RefreshSession[]>;
}
