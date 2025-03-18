import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { Order } from "../../../common/dtos/pagination/page-options.request.dto";
import { AccessRefreshTokens } from "../../auth/types/auth.types";
import { S3FileService } from "../../file/external/s3/s3-file.service";
import { FileService } from "../../file/services/file.service";
import { TokenService } from "../../token/services/token.service";
import { UploadAvatarResponseDTO } from "../dto/profiles/responses/upload-avatar.response.dto";
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
	constructor(
		@Inject(UsersRepositoryImpl) private readonly usersRepository: UsersRepository,
		private readonly tokenService: TokenService,
		@Inject(S3FileService)
		private readonly fileService: FileService
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
		await this.usersRepository.deleteById(id);
		await this.tokenService.deleteAllRefreshSessionsByUserId(id);
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

	public async getAllAvatars() {}

	public async getAvatar() {}

	// in transaction
	public async uploadPersonalProfileAvatar(
		dto: UploadAvatarDTO
	): Promise<UploadAvatarResponseDTO> {
		const user = await this.usersRepository.findById(dto.userId);

		if (!user) {
			throw new NotFoundException("User not found");
		}

		if (user.nonDeletedAvatars.length >= 5) {
			throw new BadRequestException("You can't upload more than 5 avatars");
		}

		const id = randomUUID();
		const { path, url } = await this.fileService.uploadPublicFile({
			bucket: "users-avatars",
			file: {
				buffer: dto.file.buffer,
				fieldname: dto.file.fieldname,
				mimetype: dto.file.mimetype,
				originalname: dto.file.originalname,
				size: dto.file.size,
			},
			folder: dto.userId,
			name: id,
		});

		if (!url) {
			throw new Error("Avatar upload failed");
		}

		const createdAvatar = await UserAvatar.create({
			path: path,
			userId: dto.userId,
		});

		await this.usersRepository.createAvatar(createdAvatar);

		return {
			avatarUrl: url,
		};
	}

	public async removePersonalProfileAvatar() {}
}
