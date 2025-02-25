import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../external/persistence/prisma/prisma.service";
import { User } from "../../user.entity";
import { UsersRepository } from "../../users.repository";
import { UserPrismaMapper } from "./mappers/users.mapper";

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
	constructor(private readonly prisma: PrismaService) {}

	public async findByLogin(login: string): Promise<User | null> {
		const prismaUser = await this.prisma.users.findUnique({
			where: {
				login: login,
			},
		});

		if (!prismaUser) {
			return null;
		}

		return await UserPrismaMapper.toEntity(prismaUser);
	}

	public async findByEmail(email: string): Promise<User | null> {
		const prismaUser = await this.prisma.users.findUnique({
			where: {
				email: email,
			},
		});

		if (!prismaUser) {
			return null;
		}

		return await UserPrismaMapper.toEntity(prismaUser);
	}

	public async create(user: User): Promise<void> {
		await this.prisma.users.create({
			data: {
				id: user.id,
				age: user.age,
				email: user.email,
				login: user.login,
				password: user.password,
				about: user.about,
			},
		});
	}
}
