import { Transactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { Order } from "../../../common/dtos/pagination/page-options.request.dto";
import { comparePassword, hashPassword } from "../../../common/utils/hash-password";
import { S3Service } from "../../../external/s3/s3.service";
import { AccessRefreshTokens } from "../../auth/types/auth.types";
import { TokenService } from "../../token/services/token.service";
import { RemoveAvatarDTO } from "../dto/profiles/services/remove-avatar.dto";
import { UpdatePersonalPasswordServiceDTO } from "../dto/profiles/services/update-profile-password.request.dto";
import { UploadAvatarDTO } from "../dto/profiles/services/upload-avatar.dto";
import { FindAllUsersWithPaginationOutputDTO } from "../dtos/find-all-users-w-pagination.dto";
import { CreateUserRequestDTO } from "../dtos/requests/create-user.request.dto";
import { UsersPaginatedRequestDTO } from "../dtos/requests/get-all-users.request.dto";
import { UpdateUserRequestDTO } from "../dtos/requests/update-user.request.dto";
import { UserAvatarResponseDTO } from "../dtos/responses/user-avatar.response.dto";
import { User } from "../entities/User";
import { UserAvatar } from "../entities/UserAvatar";
import { UsersRepositoryImpl } from "../external/prisma/users.repository.impl";
import { AvatarMapper } from "../mappers/avatar.mapper";
import { UsersRepository } from "../repositories/users.repository";

@Injectable()
export class UsersService {
	private readonly LOGGER = new Logger(UsersService.name);

	constructor(
		@Inject(UsersRepositoryImpl) private readonly usersRepository: UsersRepository,
		private readonly tokenService: TokenService,
		private readonly S3AvatarsService: S3Service
	) {}

	// TODO: check dto
	public async paginate(
		dto: UsersPaginatedRequestDTO
	): Promise<FindAllUsersWithPaginationOutputDTO> {
		const users = await this.usersRepository.findAllWithPagination({
			login: dto.login,
			take: dto.take!,
			skip: dto.skip,
			orderBy: dto.order === Order.ASC ? "asc" : "desc",
		});

		return {
			data: users.data.map((user) => ({
				...user,
				activeAvatar: user.activeAvatar
					? AvatarMapper.toResponseDTO(
							user.activeAvatar,
							this.S3AvatarsService.getFileUrl(user.activeAvatar.path)
						)
					: null,
			})),
			total: users.total,
		};
	}

	@Transactional()
	public async deleteById(id: string) {
		await this.usersRepository.softDeleteByUserId(id);
		await this.tokenService.deleteAllRefreshSessionsByUserId(id);
	}

	public async checkIfExists(userId: string) {
		return await this.usersRepository.exists(userId);
	}

	public async getById(id: string): Promise<User | null> {
		const user = await this.usersRepository.getById(id);

		if (!user) {
			return null;
		}

		return user;
	}

	public async getByIdForUpdate(id: string): Promise<User | null> {
		const user = await this.usersRepository.getForUpdate(id);

		if (!user) {
			return null;
		}

		return user;
	}

	public async getByEmail(email: string) {
		return await this.usersRepository.getByEmail(email);
	}

	public async getByLogin(login: string): Promise<User | null> {
		return await this.usersRepository.getByLogin(login);
	}

	// public async getUserBalance(userId: string) {
	// 	return await this.usersRepository.getBalance();
	// }

	public async create(dto: CreateUserRequestDTO): Promise<User> {
		const user = await User.create({
			login: dto.login,
			password: await hashPassword(dto.password),
			email: dto.email,
			about: dto.about,
			age: dto.age,
			avatars: [],
		});

		await this.usersRepository.create(user);

		return user;
	}

	public async update(dto: UpdateUserRequestDTO): Promise<void> {
		const user = await this.usersRepository.getById(dto.id);

		if (!user) {
			throw new NotFoundException("User not found");
		}

		if (dto.email) await user.setEmail(dto.email);
		if (dto.login) await user.setLogin(dto.login);
		if (dto.age) await user.setAge(dto.age);
		if (dto.about) await user.setAbout(dto.about);

		return await this.usersRepository.update(user);
	}

	@Transactional<TransactionalAdapterPrisma>({
		isolationLevel: "RepeatableRead",
	})
	public async updateBalance(userId: string, balance: number): Promise<void> {
		return await this.usersRepository.updateBalance(userId, balance);
	}

	@Transactional()
	public async updatePersonalProfilePassword(
		dto: UpdatePersonalPasswordServiceDTO
	): Promise<AccessRefreshTokens> {
		const user = await this.usersRepository.getById(dto.userId);

		if (!user) {
			throw new NotFoundException("User not found");
		}

		if (!(await comparePassword(dto.oldPassword, user.password))) {
			throw new BadRequestException("Old password is incorrect");
		}

		await user.setPassword(await hashPassword(dto.newPassword));

		await this.usersRepository.update(user);

		await this.tokenService.deleteAllRefreshSessionsByUserId(dto.userId);

		return await this.tokenService.createAccessRefreshTokens({
			userId: user.id,
			email: user.email,
			login: user.login,
			fingerprint: dto.fingerprint,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});
	}

	public async getAllUserAvatars(userId: string): Promise<UserAvatarResponseDTO[]> {
		const avatars = await this.usersRepository.findUserAvatarsByUserId(userId);

		return avatars.map((avatar) =>
			AvatarMapper.toResponseDTO(avatar, this.S3AvatarsService.getFileUrl(avatar.path))
		);
	}

	public async getActiveUserAvatar(userId: string): Promise<UserAvatarResponseDTO | null> {
		const avatar = await this.usersRepository.findActiveUserAvatarByUserId(userId);

		if (!avatar) {
			return null;
		}

		return AvatarMapper.toResponseDTO(avatar, this.S3AvatarsService.getFileUrl(avatar.path));
	}

	@Transactional()
	public async uploadPersonalProfileAvatar(dto: UploadAvatarDTO): Promise<UserAvatarResponseDTO> {
		const avatars = await this.usersRepository.findUserAvatarsByUserId(dto.userId);

		if (avatars.length >= 5) {
			throw new BadRequestException("You can't upload more than 5 avatars");
		}

		const id = randomUUID();
		const uploadKey = `${dto.userId}/${id}`;

		const currentActiveAvatar = avatars.find((avatar) => avatar.active);
		if (currentActiveAvatar) {
			await this.usersRepository.updateAvatarActiveStatusByAvatarId(
				currentActiveAvatar.id,
				false
			);
		}

		const avatar = await UserAvatar.create({
			id: id,
			path: uploadKey,
			userId: dto.userId,
			active: true,
		});

		await this.usersRepository.createUserAvatar(avatar);

		const { url } = await this.S3AvatarsService.uploadFile({
			Body: dto.file.buffer,
			ACL: "public-read",
			ContentType: dto.file.mimetype,
			Key: uploadKey,
		});

		this.LOGGER.log(
			{
				file: {
					url,
					bucket: this.S3AvatarsService.getBucket(),
					uploadKey,
				},
			},
			"uploaded file"
		);

		return AvatarMapper.toResponseDTO(avatar, this.S3AvatarsService.getFileUrl(avatar.path));
	}

	public async softDeletePersonalProfileAvatar(dto: RemoveAvatarDTO) {
		const avatar = await this.usersRepository.findAvatarByUserId(dto.avatarId);

		if (!avatar) {
			throw new NotFoundException("Avatar not found");
		}

		await this.usersRepository.softRemoveAvatarByAvatarId(avatar.id);
	}
}
