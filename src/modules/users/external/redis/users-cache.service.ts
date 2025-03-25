import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject } from "@nestjs/common";
import { Cache } from "cache-manager";
import { User } from "../../entities/User";
import { CachedUser } from "./interfaces/cached-user.interface";
import { UserRedisMapper } from "./mappers/users-redis.mapper";

export class UsersCacheService {
	private keyPrefix: string = "user:";

	constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

	public async getUserById(id: string): Promise<User | null> {
		const rawUser = await this.cacheManager.get<CachedUser>(`${this.keyPrefix}${id}`);

		if (!rawUser) {
			return null;
		}

		console.log(rawUser);

		return await UserRedisMapper.toEntity(rawUser);
	}

	public async cacheUser(user: User, ttl: number) {
		await this.cacheManager.set(
			`${this.keyPrefix}${user.id}`,
			UserRedisMapper.toCached(user),
			ttl
		);
	}

	public async deleteFromCacheById(id: string) {
		return this.cacheManager.del(`${this.keyPrefix}${id}`);
	}
}
