import { avatars as PrismaAvatar } from "@prisma/client";
import { UserAvatar } from "../../../entities/UserAvatar";

export class UserAvatarPrismaMapper {
	static async toEntity(avatar: PrismaAvatar): Promise<UserAvatar> {
		return await UserAvatar.create({
			id: avatar.id,
			userId: avatar.user_id,
			path: avatar.path,
			createdAt: avatar.created_at,
			updatedAt: avatar.updated_at,
			deletedAt: avatar.deleted_at,
		});
	}
}
