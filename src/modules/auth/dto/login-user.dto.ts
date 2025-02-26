import { IsEmail, IsIP, IsNotEmpty, IsString, IsUUID, ValidateIf } from "class-validator";

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

	@IsIP()
	@IsNotEmpty()
	ipAddress: string;

	@IsUUID()
	@IsNotEmpty()
	deviceId: string;

	@IsString()
	@IsNotEmpty()
	userAgent: string;
}

export interface LoginWithUserPayloadDTO {
	id: string;
	email: string;
	login: string;
	deviceId: string;
	ipAddress: string;
	userAgent: string;
}
