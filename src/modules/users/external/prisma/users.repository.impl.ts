import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../external/persistence/prisma/prisma.service";
import { User } from "../../user.entity";
import { UsersRepository } from "../../users.repository";
import { UserPrismaMapper } from "./mappers/users.mapper";

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
	constructor(private readonly prisma: PrismaService) {}

	public async findByLogin(login: string): Promise<User | null> {
		const prismaUser = await this.prisma.user.findUnique({
			where: {
				login: login,
			},
		});

		if (!prismaUser) {
			return null;
		}

		return await UserPrismaMapper.toEntity(prismaUser);
	}

	public async create(user: User): Promise<void> {
		throw new Error("not implemented");
	}
}
