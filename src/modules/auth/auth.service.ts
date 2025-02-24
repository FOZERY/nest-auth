import { ConflictException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { RegisterUserDTO } from "./dto/register-user.dto";

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	public async register(dto: RegisterUserDTO) {
		const candidate = await this.usersService.findByLogin(dto.login);

		if (candidate) {
			throw new ConflictException("Пользователь с таким логином уже существует.");
		}

		// await this.usersService.create(dto);
	}
}
