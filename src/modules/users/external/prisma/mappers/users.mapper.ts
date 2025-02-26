import { users as PrismaUser } from "@prisma/client";
import { User } from "../../../entities/User";

export class UserPrismaMapper {
	static async toEntity(prismaUser: PrismaUser): Promise<User> {
		return await User.create({
			id: prismaUser.id,
			age: prismaUser.age,
			email: prismaUser.email,
			login: prismaUser.login,
			password: prismaUser.password,
			about: prismaUser.about,
			createdAt: prismaUser.created_at,
			updatedAt: prismaUser.updated_at,
			deletedAt: prismaUser.deleted_at,
		});
	}
}
