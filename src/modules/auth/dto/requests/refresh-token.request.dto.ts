import { IsIP, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RefreshTokenRequestDTO {
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
