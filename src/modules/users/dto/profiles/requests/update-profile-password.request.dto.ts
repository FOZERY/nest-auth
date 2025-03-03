import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIP, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdatePersonalProfilePasswordRequestDTO {
	@ApiProperty({
		description: "Old password",
		example: "OldPass1234!",
		type: "string",
		maxLength: 255,
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	oldPassword: string;

	@ApiProperty({
		description: "New password",
		example: "Pass1234!",
		type: "string",
		maxLength: 255,
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	newPassword: string;

	@ApiProperty({
		description: "Fingerprint",
		example: "6fd4s86f1ds68f41ds8f4ds",
		type: "string",
		maxLength: 255,
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	fingerprint: string;

	@ApiPropertyOptional({
		description: "IP address",
		example: "192.168.1.100",
		type: "string",
		maxLength: 255,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsIP()
	@MaxLength(255)
	ipAddress?: string;

	@ApiPropertyOptional({
		description: "User agent",
		example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
		type: "string",
		maxLength: 255,
	})
	@IsOptional()
	@IsString()
	@MaxLength(255)
	userAgent?: string;
}
