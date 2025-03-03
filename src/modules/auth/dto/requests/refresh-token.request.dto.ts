import { ApiProperty } from "@nestjs/swagger";
import { IsIP, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class RefreshTokenRequestDTO {
	@ApiProperty({
		description: "Fingerprint",
		example: "6fd4s86f1ds68f41ds8f4ds",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	fingerprint: string;

	@ApiProperty({
		description: "Ip address",
		example: "192.168.1.100",
		required: false,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsIP()
	ipAddress?: string;

	@ApiProperty({
		description: "User agent",
		example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
		required: false,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	userAgent?: string;
}
