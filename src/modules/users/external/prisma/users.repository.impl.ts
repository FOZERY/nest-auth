import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../external/persistence/prisma/prisma.service";
import { User } from "../../entities/User";
import { UsersRepository } from "../../users.repository";
import { UserPrismaMapper } from "./mappers/users.mapper";

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
	constructor(private readonly prisma: PrismaService) {}

	public async findById(id: string, withDeleted: boolean = false): Promise<User | null> {
		const prismaUser = await this.prisma.users.findUnique({
			where: {
				id: id,
				deleted_at: withDeleted ? undefined : null,
			},
		});

		if (!prismaUser) {
			return null;
		}

		return await UserPrismaMapper.toEntity(prismaUser);
	}

	public async findByLogin(login: string, withDeleted: boolean = false): Promise<User | null> {
		const prismaUser = await this.prisma.users.findUnique({
			where: {
				login: login,
				deleted_at: withDeleted ? undefined : null,
			},
		});

		if (!prismaUser) {
			return null;
		}

		return await UserPrismaMapper.toEntity(prismaUser);
	}

	public async findByEmail(email: string, withDeleted: boolean = false): Promise<User | null> {
		const prismaUser = await this.prisma.users.findUnique({
			where: {
				email: email,
				deleted_at: withDeleted ? undefined : null,
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

	public async update(user: User): Promise<void> {
		console.log(user);
		await this.prisma.users.update({
			data: {
				id: user.id,
				age: user.age,
				email: user.email,
				login: user.login,
				password: user.password,
				about: user.about,
			},
			where: {
				id: user.id,
			},
		});
	}

	public async deleteById(id: string): Promise<void> {
		await this.prisma.users.update({
			data: {
				deleted_at: new Date(),
			},
			where: {
				id: id,
			},
		});
	}
}
