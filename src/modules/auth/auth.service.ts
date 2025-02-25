import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import argon2 from "argon2";
import { UsersService } from "../users/users.service";
import { RegisterUserDTO } from "./dto/register-user.dto";
import { AuthenticatedRequestUser } from "./types/authenticated-request.type";
@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		@Inject("AccessJwtService") private readonly accessJwtService: JwtService,
		@Inject("RefreshJwtService") private readonly refreshJwtService: JwtService,
	) {
		console.log(accessJwtService);
	}

	public async validateUser(
		loginOrEmail: string,
		password: string,
	): Promise<AuthenticatedRequestUser | null> {
		const user =
			(await this.usersService.findByLogin(loginOrEmail)) ||
			(await this.usersService.findByEmail(loginOrEmail));

		if (!user) {
			return null;
		}

		if (!(await argon2.verify(user.password, password))) {
			return null;
		}

		return {
			id: user.id,
			login: user.login,
			email: user.email,
		};
	}

	public async login(userPayload: AuthenticatedRequestUser) {
		return await this.accessJwtService.signAsync(userPayload);
	}

	public async register(dto: RegisterUserDTO): Promise<string> {
		const candidateByLogin = await this.usersService.findByLogin(dto.login);

		if (candidateByLogin) {
			throw new ConflictException("Пользователь с таким логином уже существует.");
		}

		const candidateByEmail = await this.usersService.findByEmail(dto.email);

		if (candidateByEmail) {
			throw new ConflictException("Пользователь с таким email уже существует.");
		}

		const user = await this.usersService.create(dto);

		return await this.accessJwtService.signAsync({
			id: user.id,
			login: user.login,
			email: user.email,
		});
	}

	public async refreshToken() {}
}
