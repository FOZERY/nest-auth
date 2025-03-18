import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { Order } from "../../../common/dtos/pagination/page-options.request.dto";
import { AccessRefreshTokens } from "../../auth/types/auth.types";

import { Transactional } from "@nestjs-cls/transactional";
import { ConfigService } from "@nestjs/config";
import { FileUploadStrategy } from "../../file/strategies/file.strategy";
import { S3FileUploadStrategy } from "../../file/strategies/impl/s3-file.strategy";
import { TokenService } from "../../token/services/token.service";
import { UploadAvatarResponseDTO } from "../dto/profiles/responses/upload-avatar.response.dto";
import { RemoveAvatarDTO } from "../dto/profiles/services/remove-avatar.dto";
import { UpdatePersonalPasswordServiceDTO } from "../dto/profiles/services/update-profile-password.request.dto";
import { UploadAvatarDTO } from "../dto/profiles/services/upload-avatar.dto";
import { FindAllUsersWithPaginationOutputDTO } from "../dto/users/repositories/find-all-users-w-pagination.dto";
import { CreateUserRequestDTO } from "../dto/users/requests/create-user.request.dto";
import { GetAllUsersRequestQueryDTO } from "../dto/users/requests/get-all-users.request.dto";
import { UpdateUserRequestDTO } from "../dto/users/requests/update-user.request.dto";
import { User } from "../entities/User";
import { UserAvatar } from "../entities/UserAvatar";
import { UsersRepositoryImpl } from "../external/prisma/users.repository.impl";
import { UsersRepository } from "../repositories/users.repository";

@Injectable()
export class UsersService {
	private readonly S3_AVATARS_BUCKET: string = "users-avatars";

	constructor(
		@Inject(UsersRepositoryImpl) private readonly usersRepository: UsersRepository,
		private readonly tokenService: TokenService,
		@Inject(S3FileUploadStrategy)
		private readonly fileUploadStrategy: FileUploadStrategy,
		private readonly configService: ConfigService
	) {}

	public async getAllUsersWithPagination(
		dto: GetAllUsersRequestQueryDTO,
		withDeleted: boolean = false
	): Promise<FindAllUsersWithPaginationOutputDTO> {
		return await this.usersRepository.findAllWithPagination(
			{
				login: dto.login,
				take: dto.take!,
				skip: dto.skip,
				orderBy: dto.order === Order.ASC ? "asc" : "desc",
			},
			withDeleted
		);
	}

	public async deleteById(id: string) {
		await this.usersRepository.softDeleteById(id);
		await this.tokenService.deleteAllRefreshSessionsByUserId(id);
	}

	public async checkIsExists(id: string) {
		return await this.usersRepository.isExists(id);
	}

	public async findById(id: string, withDeleted: boolean = false) {
		return await this.usersRepository.findById(id, withDeleted);
	}

	public async findByEmail(email: string, withDeleted: boolean = false) {
		return await this.usersRepository.findByEmail(email, withDeleted);
	}

	public async findByLogin(login: string, withDeleted: boolean = false): Promise<User | null> {
		return await this.usersRepository.findByLogin(login, withDeleted);
	}

	public async create(dto: CreateUserRequestDTO): Promise<User> {
		const user = await User.create({
			login: dto.login,
			password: dto.password,
			email: dto.email,
			about: dto.about,
			age: dto.age,
			avatars: [],
		});

		await this.usersRepository.create(user);

		return user;
	}

	public async update(dto: UpdateUserRequestDTO): Promise<void> {
		const user = await this.usersRepository.findById(dto.id);

		if (!user) {
			throw new NotFoundException("User not found");
		}

		if (dto.email) await user.setEmail(dto.email);
		if (dto.login) await user.setLogin(dto.login);
		if (dto.age) await user.setAge(dto.age);
		if (dto.about) await user.setAbout(dto.about);

		return await this.usersRepository.update(user);
	}

	public async updatePersonalProfilePassword(
		dto: UpdatePersonalPasswordServiceDTO
	): Promise<AccessRefreshTokens> {
		const user = await this.usersRepository.findById(dto.userId);

		if (!user) {
			throw new NotFoundException("User not found");
		}

		if (!(await user.comparePassword(dto.oldPassword))) {
			throw new BadRequestException("Old password is incorrect");
		}

		await user.setPassword(dto.newPassword);
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

	public async getAllUserAvatarsUrl(userId: string): Promise<string[]> {
		const avatars = await this.usersRepository.findNonDeletedUserAvatars(userId);

		return avatars.map(
			(avatar) =>
				`${this.configService.get<string>("S3_URL")}/${this.S3_AVATARS_BUCKET}/${avatar.path}`
		);
	}

	public async getActiveUserAvatarUrl(userId: string): Promise<string | null> {
		const avatar = await this.usersRepository.findActiveUserAvatar(userId);

		if (!avatar) {
			return null;
		}

		return `${this.configService.get<string>("S3_URL")}/${this.S3_AVATARS_BUCKET}/${avatar?.path}`;
	}

	@Transactional()
	public async uploadPersonalProfileAvatar(
		dto: UploadAvatarDTO
	): Promise<UploadAvatarResponseDTO> {
		const avatars = await this.usersRepository.findNonDeletedUserAvatars(dto.userId);

		if (avatars.length >= 5) {
			throw new BadRequestException("You can't upload more than 5 avatars");
		}

		const id = randomUUID();
		const uploadPath = `${dto.userId}/${id}`;
		// TODO: BullMQ
		const { path, url } = await this.fileUploadStrategy.uploadPublicFile({
			bucket: this.S3_AVATARS_BUCKET,
			path: uploadPath,
			file: {
				buffer: dto.file.buffer,
				fieldname: dto.file.fieldname,
				mimetype: dto.file.mimetype,
				originalname: dto.file.originalname,
				size: dto.file.size,
			},
		});

		try {
			if (!url) {
				throw new Error("Avatar upload failed. URL is undefined");
			}

			const currentActiveAvatar = avatars.find((avatar) => avatar.active);
			if (currentActiveAvatar) {
				await this.usersRepository.updateAvatarActiveStatusById(
					currentActiveAvatar.id,
					false
				);
			}

			const avatar = await UserAvatar.create({
				id: id,
				path: path,
				userId: dto.userId,
				active: true,
			});

			await this.usersRepository.createAvatar(avatar);

			return {
				avatarUrl: url,
			};
		} catch (error) {
			// TODO: BullMQ
			await this.fileUploadStrategy.removeFile({
				path: path,
				bucket: this.S3_AVATARS_BUCKET,
			});
			throw error;
		}
	}

	public async removePersonalProfileAvatar(dto: RemoveAvatarDTO) {
		const avatar = await this.usersRepository.findAvatarById(dto.avatarId);

		if (!avatar) {
			throw new NotFoundException("Avatar not found");
		}

		await this.usersRepository.softRemoveAvatarById(avatar.id);
	}
}
