import { UserAvatar } from "../../../entities/UserAvatar";
import { CachedAvatar } from "../interfaces/cached-user.interface";

export class UserAvatarRedisMapper {
	static async toEntity(avatar: CachedAvatar): Promise<UserAvatar> {
		return await UserAvatar.create({
			id: avatar.id,
			userId: avatar.userId,
			path: avatar.path,
			active: avatar.active,
			createdAt: avatar.createdAt ? new Date(avatar.createdAt) : null,
			updatedAt: avatar.updatedAt ? new Date(avatar.updatedAt) : null,
			deletedAt: avatar.deletedAt ? new Date(avatar.deletedAt) : null,
		});
	}

	static toCached(avatar: UserAvatar): CachedAvatar {
		return {
			id: avatar.id,
			userId: avatar.userId,
			active: avatar.active,
			path: avatar.path,
			createdAt: avatar.createdAt ? avatar.createdAt.toISOString() : null,
			deletedAt: avatar.deletedAt ? avatar.deletedAt.toISOString() : null,
			updatedAt: avatar.updatedAt ? avatar.updatedAt.toISOString() : null,
		};
	}
}
