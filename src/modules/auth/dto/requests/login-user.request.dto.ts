import { IsEmail, IsIP, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";

export class LoginUserRequestDTO {
	@ValidateIf((o) => !o.email)
	@IsNotEmpty()
	@IsString()
	login?: string;

	@ValidateIf((o) => !o.login)
	@IsNotEmpty()
	@IsEmail()
	email?: string;

	@IsNotEmpty()
	@IsString()
	password: string;

	@IsOptional()
	@IsNotEmpty()
	@IsIP()
	ipAddress?: string;

	@IsNotEmpty()
	@IsString()
	fingerprint: string;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	userAgent?: string;
}
