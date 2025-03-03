import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsIP,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	ValidateIf,
} from "class-validator";

export class LoginUserRequestDTO {
	@ApiProperty({
		description: "User login",
		required: false,
		example: "user123",
		type: String,
		maxLength: 255,
	})
	@ValidateIf((o) => !o.email)
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	login?: string;

	@ApiProperty({
		description: "User email",
		required: false,
		example: "user@example.com",
		type: String,
		maxLength: 255,
	})
	@ValidateIf((o) => !o.login)
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(255)
	email?: string;

	@ApiProperty({
		description: "User password",
		required: true,
		example: "password123",
		type: String,
		maxLength: 255,
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	password: string;

	@ApiProperty({
		description: "IP address",
		required: false,
		example: "192.168.1.1",
		type: String,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsIP()
	ipAddress?: string;

	@ApiProperty({
		description: "Browser fingerprint",
		required: true,
		example: "a1b2c3d4e5f6",
		type: String,
		maxLength: 255,
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	fingerprint: string;

	@ApiProperty({
		description: "User agent string",
		required: false,
		example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
		type: String,
		maxLength: 255,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	userAgent?: string;
}
