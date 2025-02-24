import { User as PrismaUser } from "@prisma/client";
import { User } from "../../../user.entity";

export class UserPrismaMapper {
	static async toEntity(prismaUser: PrismaUser): Promise<User> {
		return await User.create({
			id: prismaUser.id,
			age: prismaUser.age,
			email: prismaUser.email,
			login: prismaUser.login,
			password: prismaUser.password,
			about: prismaUser.about,
			createdAt: prismaUser.createdAt,
			updatedAt: prismaUser.updatedAt,
			deletedAt: prismaUser.deletedAt,
		});
	}
}
