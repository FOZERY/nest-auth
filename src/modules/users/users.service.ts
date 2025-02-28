import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AccessRefreshTokens } from "../auth/types/auth.types";
import { TokenService } from "../token/token.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserPasswordDTO } from "./dto/update-user-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/User";
import { UsersRepositoryImpl } from "./external/prisma/users.repository.impl";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
	constructor(
		@Inject(UsersRepositoryImpl) private readonly usersRepository: UsersRepository,
		private readonly tokenService: TokenService
	) {}

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

	public async create(dto: CreateUserDTO): Promise<User> {
		const user = await User.create({
			login: dto.login,
			password: dto.password,
			email: dto.email,
			about: dto.about,
			age: dto.age,
		});

		await this.usersRepository.create(user);

		return user;
	}

	public async update(dto: UpdateUserDto): Promise<void> {
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

	public async updateProfilePasswordByUserId(
		dto: UpdateUserPasswordDTO
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

		const accessToken = await this.tokenService.createAccessToken({
			userId: user.id,
			email: user.email,
			login: user.login,
		});
		const refreshSession = await this.tokenService.createRefreshSession({
			userId: user.id,
			fingerprint: dto.fingerprint,
			ipAddress: dto.ipAddress,
			userAgent: dto.userAgent,
		});
		return {
			accessToken,
			refreshSession,
		};
	}
}
