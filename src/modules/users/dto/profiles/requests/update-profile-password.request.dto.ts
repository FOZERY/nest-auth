import { ApiProperty } from "@nestjs/swagger";
import { IsIP, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdatePersonalProfilePasswordRequestDTO {
	@ApiProperty({
		description: "Old password",
		example: "123456",
	})
	@IsNotEmpty()
	@IsString()
	oldPassword: string;

	@ApiProperty({
		description: "New password",
		example: "newPassword",
	})
	@IsNotEmpty()
	@IsString()
	newPassword: string;

	@ApiProperty({
		description: "Fingerprint",
		example: "fingerprint",
	})
	@IsNotEmpty()
	@IsString()
	fingerprint: string;

	@ApiProperty({
		description: "IP address",
		example: "192.168.0.1",
		required: false,
	})
	@IsNotEmpty()
	@IsIP()
	ipAddress: string;

	@ApiProperty({
		description: "User agent",
		example:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
		required: false,
	})
	@IsOptional()
	@IsString()
	userAgent?: string;
}
