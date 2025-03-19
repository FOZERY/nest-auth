import { avatars as PrismaAvatar, users as PrismaUser } from "@prisma/client";
import { User } from "../../../entities/User";
import { UserAvatarPrismaMapper } from "./avatars.mapper";

export class UserPrismaMapper {
	static async toEntity(prismaUser: PrismaUser, avatars: PrismaAvatar[] = []): Promise<User> {
		const entityAvatars = await Promise.all(
			avatars.map(async (avatar) => await UserAvatarPrismaMapper.toEntity(avatar))
		);

		return await User.create({
			id: prismaUser.id,
			age: prismaUser.age,
			email: prismaUser.email,
			login: prismaUser.login,
			password: prismaUser.password,
			about: prismaUser.about,
			avatars: entityAvatars,
			createdAt: prismaUser.created_at,
			updatedAt: prismaUser.updated_at,
			deletedAt: prismaUser.deleted_at,
		});
	}
}
