import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersRepositoryImpl } from "./external/prisma/users.repository.impl";
import { User } from "./user.entity";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
	constructor(@Inject(UsersRepositoryImpl) private readonly usersRepository: UsersRepository) {}

	public async deleteById(id: string) {
		return await this.usersRepository.deleteById(id);
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
}
