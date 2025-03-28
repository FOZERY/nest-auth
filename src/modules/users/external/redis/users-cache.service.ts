import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "../../../../external/cache/redis/redis.service";
import { User } from "../../entities/User";
import { CachedUser } from "../../interfaces/cached-user.interface";
import { UserCacheMapper } from "../../mappers/user-cache.mapper";

@Injectable()
export class UsersCacheService {
	private readonly logger = new Logger(UsersCacheService.name);
	private readonly keyPrefix: string = "user:";
	private readonly defaultTtlSeconds: number = 30; // 30 seconds

	constructor(private readonly redis: RedisService) {}

	public async getById(id: string): Promise<CachedUser | null> {
		return this.redis.getJson<CachedUser>(`${this.keyPrefix}${id}`);
	}

	public async set(user: User, ttlSeconds: number = this.defaultTtlSeconds): Promise<void> {
		await this.redis.setJson(
			`${this.keyPrefix}${user.id}`,
			UserCacheMapper.toCache(user),
			ttlSeconds
		);
	}

	public async delById(id: string): Promise<void> {
		await this.redis.del(`${this.keyPrefix}${id}`);
	}
}
