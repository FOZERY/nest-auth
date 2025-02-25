import { RefreshSession } from "../interfaces/RefreshSession";

export interface RefreshSessionsRepository {
	createRefreshSession(session: RefreshSession): Promise<void>;

	getRefreshSessionById(id: string): Promise<RefreshSession>;

	getRefreshSessionsByUserId(userId: string): Promise<RefreshSession[]>;
}
