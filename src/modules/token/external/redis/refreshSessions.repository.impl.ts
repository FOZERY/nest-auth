import { Injectable } from "@nestjs/common";
import { RedisService } from "../../../../external/cache/redis/redis.service";
import { RefreshSession } from "../../entities/RefreshSession";
import { RefreshSessionMapper } from "../../mappers/refreshSession.mapper";
import { RefreshSessionsRepository } from "../../repositories/refreshSessions.repository";
import { RefreshSessionCached } from "../../types/refreshSession-cached.type";

@Injectable()
export class RefreshSessionsRedisRepositoryImpl implements RefreshSessionsRepository {
	private readonly sessionKeyPrefix = "refresh_session:";
	private readonly userSessionsKeyPrefix = "user_sessions:";

	constructor(private readonly redis: RedisService) {}

	public async createRefreshSession(session: RefreshSession): Promise<void> {
		const sessionKey = `${this.sessionKeyPrefix}${session.refreshToken}`;
		const userSessionKey = `${this.userSessionsKeyPrefix}${session.userId}`;
		const expiresAt = session.expiresAt.getTime();
		const userSessionToken = `${session.refreshToken}:${expiresAt}`;

		const pipeline = this.redis.pipeline();

		// Сохраняем сессию
		pipeline.psetex(
			sessionKey,
			session.expiresInMs,
			JSON.stringify(RefreshSessionMapper.fromEntityToCached(session))
		);

		// Добавляем ID сессии в список сессий пользователя
		pipeline.sadd(userSessionKey, userSessionToken);

		await pipeline.exec();
	}

	public async deleteRefreshSessionByToken(refreshToken: string): Promise<void> {
		const sessionKey = `${this.sessionKeyPrefix}${refreshToken}`;

		// Получаем сессию для определения userId
		const session = await this.getRefreshSessionByToken(refreshToken);
		if (!session) return;

		const userSessionsKey = `${this.userSessionsKeyPrefix}${session.userId}`;

		const pipeline = this.redis.pipeline();

		// Удаляем сессию
		pipeline.del(sessionKey);

		// Сканируем и удаляем из множества пользователя
		const userSessions = await this.redis.smembers(userSessionsKey);
		const sessionToDelete = userSessions.find((s) => s.startsWith(refreshToken));

		if (sessionToDelete) {
			pipeline.srem(userSessionsKey, sessionToDelete);
		}

		await pipeline.exec();
	}

	public async getRefreshSessionByToken(token: string): Promise<RefreshSession | null> {
		const sessionKey = `${this.sessionKeyPrefix}${token}`;
		const session = await this.redis.getJson<RefreshSessionCached>(sessionKey, (key, value) => {
			if (key === "expiresAt" || key === "createdAt") {
				value = new Date(value);
			}
			return value;
		});

		if (!session) return null;

		return await RefreshSessionMapper.fromCachedToEntity(session);
	}

	public async getAllRefreshSessionsByUserIdOrderedByCreatedAtAsc(
		userId: string
	): Promise<RefreshSession[]> {
		try {
			const userSessions = await this.redis.smembers(
				`${this.userSessionsKeyPrefix}${userId}`
			);
			if (!userSessions.length) return [];

			// Получаем все сессии одним запросом через pipeline
			const pipeline = this.redis.pipeline();
			userSessions.forEach((session) => {
				const token = session.split(":")[0];
				pipeline.get(`${this.sessionKeyPrefix}${token}`);
			});

			const sessionsData = await pipeline.exec();
			if (!sessionsData) return [];

			// Преобразуем и фильтруем результаты
			const sessions = sessionsData
				.map(([err, data]) => {
					if (err || !data) return null;
					const session = JSON.parse(data as string, (key, value) => {
						if (key === "expiresAt" || key === "createdAt") {
							return new Date(value);
						}
						return value;
					}) as RefreshSessionCached;
					return session;
				})
				.filter(
					(session): session is RefreshSessionCached =>
						session !== null && session.expiresAt > Date.now() // проверяем, что срок действия сессии не истек, ибо могли не успеть очистить по кроне ведь в SET нет TTL
				)
				.sort((a, b) => a.createdAt - b.createdAt); // сортируем по createdAt

			// Преобразуем в доменные сущности
			return Promise.all(
				sessions.map((session) => RefreshSessionMapper.fromCachedToEntity(session))
			);
		} catch (error) {
			throw new Error(`Failed to get refresh sessions: ${error.message}`);
		}
	}

	public async deleteAllRefreshSessionsByUserId(userId: string): Promise<void> {
		const userSessionsKey = `${this.userSessionsKeyPrefix}${userId}`;
		const userSessions = await this.redis.smembers(userSessionsKey);

		if (!userSessions.length) return;

		const pipeline = this.redis.pipeline();

		// Удаляем все сессии
		userSessions.forEach((session) => {
			const token = session.split(":")[0];
			pipeline.del(`${this.sessionKeyPrefix}${token}`);
		});

		// Удаляем ключ со списком сессий пользователя
		pipeline.del(userSessionsKey);

		await pipeline.exec();
	}

	public async deleteAllRefreshSessionsByUserIdExceptToken(
		userId: string,
		refreshToken: string
	): Promise<void> {
		const userSessionsKey = `${this.userSessionsKeyPrefix}${userId}`;
		const userSessions = await this.redis.smembers(userSessionsKey);

		if (userSessions.length === 0) return;

		const sessionsToDelete = userSessions.filter(
			(session) => !session.startsWith(`${refreshToken}:`)
		);

		if (sessionsToDelete.length === 0) return;

		const pipeline = this.redis.pipeline();

		// Удаляем сессии
		sessionsToDelete.forEach((session) => {
			const token = session.split(":")[0];
			pipeline.del(`${this.sessionKeyPrefix}${token}`);
		});

		// Удаляем записи из множества пользователя
		pipeline.srem(userSessionsKey, ...sessionsToDelete);

		await pipeline.exec();
	}
}
