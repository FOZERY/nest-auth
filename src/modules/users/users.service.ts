import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UsersRepositoryImpl } from "./external/prisma/users.repository.impl";
import { User } from "./user.entity";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
	constructor(@Inject(UsersRepositoryImpl) private readonly usersRepository: UsersRepository) {}

	public async create(dto: CreateUserDTO) {
		const user = await User.create({
			login: dto.login,
			password: dto.password,
			email: dto.email,
			about: dto.about,
			age: dto.age,
		});

		await this.usersRepository.create(user);
	}

	public async findByLogin(login: string) {
		return await this.usersRepository.findByLogin(login);
	}
}
