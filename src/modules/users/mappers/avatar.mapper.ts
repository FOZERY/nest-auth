import { UserAvatarResponseDTO } from "../dtos/responses/user-avatar.response.dto";
import { UserAvatar } from "../entities/UserAvatar";
import { CachedAvatar } from "../interfaces/cached-user.interface";

export class AvatarMapper {
	public static toResponseDTO(
		avatar: UserAvatar | CachedAvatar,
		url: string
	): UserAvatarResponseDTO {
		return {
			id: avatar.id,
			userId: avatar.userId,
			url: url,
			active: avatar.active,
			createdAt: avatar.createdAt,
		};
	}
}
