import { IsIP, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class LogoutUserDTO {
	@IsNotEmpty()
	@IsIP()
	ipAddress: string;

	@IsNotEmpty()
	@IsUUID()
	deviceId: string;

	@IsNotEmpty()
	@IsString()
	userAgent: string;
}
