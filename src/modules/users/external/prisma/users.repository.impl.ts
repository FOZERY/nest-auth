import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { Injectable } from "@nestjs/common";
import {
	FindAllUsersWithPaginationInputDTO,
	FindAllUsersWithPaginationOutputDTO,
} from "../../dto/users/repositories/find-all-users-w-pagination.dto";
import { User } from "../../entities/User";
import { UserAvatar } from "../../entities/UserAvatar";
import { FindUserOptions } from "../../interfaces/find-user-options";
import { UsersRepository } from "../../repositories/users.repository";
import { UserAvatarPrismaMapper } from "./mappers/avatars.mapper";
import { UserPrismaMapper } from "./mappers/users.mapper";

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
	constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

	public async exists(id: string): Promise<boolean> {
		const user = await this.txHost.tx.users.findUnique({
			where: {
				id: id,
				deleted_at: null,
			},
		});
		return !!user;
	}

	public async findAllWithPagination(
		dto: FindAllUsersWithPaginationInputDTO,
		options: FindUserOptions
	): Promise<FindAllUsersWithPaginationOutputDTO> {
		const total = await this.txHost.tx.users.count({
			where: {
				deleted_at: options.withDeleted ? undefined : null,
				login: {
					startsWith: dto.login,
					mode: "insensitive",
				},
			},
		});

		const prismaUsers = await this.txHost.tx.users.findMany({
			skip: dto.skip,
			take: dto.take,
			orderBy: {
				id: dto.orderBy,
			},
			select: {
				id: true,
				login: true,
				age: true,
				about: true,
				avatars: options.withAvatars,
			},
			where: {
				deleted_at: options.withDeleted ? undefined : null,
				login: {
					startsWith: dto.login,
					mode: "insensitive",
				},
			},
		});

		return {
			data: prismaUsers,
			total,
		};
	}

	public async findByUserId(id: string, options: FindUserOptions): Promise<User | null> {
		const prismaUser = await this.txHost.tx.users.findUnique({
			where: {
				id: id,
				deleted_at: options.withDeleted ? undefined : null,
			},
			include: {
				avatars: options.withAvatars,
			},
		});

		if (!prismaUser) {
			return null;
		}

		const { avatars, ...user } = prismaUser;
		return await UserPrismaMapper.toEntity(user, avatars);
	}

	public async findByLogin(login: string, options: FindUserOptions): Promise<User | null> {
		const prismaUser = await this.txHost.tx.users.findUnique({
			where: {
				login: login,
				deleted_at: options.withDeleted ? undefined : null,
			},
			include: {
				avatars: options.withAvatars,
			},
		});

		if (!prismaUser) {
			return null;
		}

		const { avatars, ...user } = prismaUser;
		return await UserPrismaMapper.toEntity(user, avatars);
	}

	public async findByEmail(email: string, options: FindUserOptions): Promise<User | null> {
		const prismaUser = await this.txHost.tx.users.findUnique({
			where: {
				email: email,
				deleted_at: options.withDeleted ? undefined : null,
			},
			include: {
				avatars: options.withAvatars,
			},
		});

		if (!prismaUser) {
			return null;
		}

		const { avatars, ...user } = prismaUser;
		return await UserPrismaMapper.toEntity(user, avatars);
	}

	public async create(user: User): Promise<void> {
		await this.txHost.tx.users.create({
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
		await this.txHost.tx.users.update({
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

	public async findAvatarByUserId(id: string): Promise<UserAvatar | null> {
		const prismaAvatar = await this.txHost.tx.avatars.findUnique({
			where: {
				id: id,
				deleted_at: null,
			},
		});

		if (!prismaAvatar) {
			return null;
		}

		return await UserAvatarPrismaMapper.toEntity(prismaAvatar);
	}

	public async findUserAvatarsByUserId(userId: string): Promise<UserAvatar[]> {
		const prismaAvatars = await this.txHost.tx.avatars.findMany({
			where: {
				user_id: userId,
				deleted_at: null,
			},
		});

		return await Promise.all(
			prismaAvatars.map(
				async (prismaAvatar) => await UserAvatarPrismaMapper.toEntity(prismaAvatar)
			)
		);
	}

	public async findActiveUserAvatarByUserId(userId: string): Promise<UserAvatar | null> {
		const prismaAvatar = await this.txHost.tx.avatars.findFirst({
			where: {
				user_id: userId,
				active: true,
				deleted_at: null,
			},
		});

		if (!prismaAvatar) {
			return null;
		}

		return await UserAvatarPrismaMapper.toEntity(prismaAvatar);
	}

	public async createUserAvatar(avatar: UserAvatar): Promise<void> {
		await this.txHost.tx.avatars.create({
			data: {
				id: avatar.id,
				user_id: avatar.userId,
				path: avatar.path,
				active: avatar.active,
			},
		});
	}

	public async softRemoveAvatarByAvatarId(id: string): Promise<void> {
		await this.txHost.tx.avatars.update({
			where: {
				id: id,
			},
			data: {
				active: false,
				deleted_at: new Date(),
			},
		});
	}

	public async updateAvatarActiveStatusByAvatarId(
		avatarId: string,
		isActive: boolean
	): Promise<void> {
		await this.txHost.tx.avatars.update({
			where: {
				id: avatarId,
				deleted_at: null,
			},
			data: {
				active: isActive,
			},
		});
	}

	public async softDeleteByUserId(id: string): Promise<void> {
		await this.txHost.tx.users.update({
			data: {
				deleted_at: new Date(),
			},
			where: {
				id: id,
			},
		});
	}
}
