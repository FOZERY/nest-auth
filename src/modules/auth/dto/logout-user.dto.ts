import { IsIP, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class LogoutUserDTO {
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
