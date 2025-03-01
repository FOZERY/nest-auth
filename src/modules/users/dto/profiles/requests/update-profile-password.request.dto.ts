import { IsIP, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdatePersonalProfilePasswordRequestDTO {
	@IsNotEmpty()
	@IsString()
	oldPassword: string;

	@IsNotEmpty()
	@IsString()
	newPassword: string;

	@IsNotEmpty()
	@IsIP()
	ipAddress: string;

	@IsNotEmpty()
	@IsString()
	fingerprint: string;

	@IsOptional()
	@IsString()
	userAgent?: string;
}
