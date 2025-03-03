import { ApiProperty } from "@nestjs/swagger";
import { IsIP, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class RefreshTokenRequestDTO {
	@ApiProperty({
		description: "Fingerprint",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	fingerprint: string;

	@ApiProperty({
		description: "Ip address",
		example: "192.168.0.1",
		required: false,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsIP()
	ipAddress?: string;

	@ApiProperty({
		description: "User agent",
		example:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
		required: false,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	userAgent?: string;
}
