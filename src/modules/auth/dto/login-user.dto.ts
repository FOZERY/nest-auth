import { IsIP, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class LoginUserDTO {
	@IsString()
	@IsNotEmpty()
	loginOrEmail?: string;

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
