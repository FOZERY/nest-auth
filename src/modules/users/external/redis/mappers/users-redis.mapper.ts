import { User } from "../../../entities/User";
import { CachedUser } from "../interfaces/cached-user.interface";
import { UserAvatarRedisMapper } from "./avatars-redis.mapper";

export class UserRedisMapper {
	static async toEntity(redisUser: CachedUser): Promise<User> {
		const entityAvatars = await Promise.all(
			redisUser.avatars.map(async (avatar) => await UserAvatarRedisMapper.toEntity(avatar))
		);

		return await User.create({
			id: redisUser.id,
			age: redisUser.age,
			email: redisUser.email,
			login: redisUser.login,
			password: redisUser.password,
			about: redisUser.about,
			avatars: entityAvatars,
			createdAt: redisUser.createdAt ? new Date(redisUser.createdAt) : null,
			updatedAt: redisUser.updatedAt ? new Date(redisUser.updatedAt) : null,
			deletedAt: redisUser.deletedAt ? new Date(redisUser.deletedAt) : null,
		});
	}

	public static toCached(user: User): CachedUser {
		return {
			id: user.id,
			login: user.login,
			email: user.email,
			password: user.password,
			age: user.age,
			about: user.about,
			avatars: user.avatars.map((avatar) => UserAvatarRedisMapper.toCached(avatar)),
			createdAt: user.createdAt ? user.createdAt.toISOString() : null,
			deletedAt: user.deletedAt ? user.deletedAt.toISOString() : null,
			updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
		};
	}
}
