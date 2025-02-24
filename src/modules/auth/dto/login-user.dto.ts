import { IsEmail, IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class LoginUserDTO {
	@IsString()
	@IsNotEmpty()
	@ValidateIf((o) => !o.email)
	login?: string;

	@IsEmail()
	@IsNotEmpty()
	@ValidateIf((o) => !o.login)
	email?: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
