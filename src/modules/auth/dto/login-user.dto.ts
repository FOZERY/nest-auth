import {
	IsEmail,
	IsIP,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	ValidateIf,
} from "class-validator";

export class LoginUserDTO {
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

	@IsNotEmpty()
	@IsIP()
	ipAddress: string;

	@IsNotEmpty()
	@IsString()
	fingerprint: string;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	userAgent?: string;
}

export interface LoginWithUserPayloadDTO {
	id: string;
	email: string;
	login: string;
	deviceId: string;
	ipAddress: string;
	userAgent: string;
}
