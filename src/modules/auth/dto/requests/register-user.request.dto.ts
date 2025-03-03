import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsIP,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
} from "class-validator";

export class RegisterUserRequestDTO {
	@ApiProperty({
		description: "Login",
		example: "user123",
		maxLength: 255,
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	login: string;

	@ApiProperty({
		description: "Email",
		example: "user@example.com",
		maxLength: 255,
	})
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(255)
	email: string;

	@ApiProperty({
		description: "Password",
		example: "password123",
		maxLength: 255,
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	password: string;

	@ApiProperty({
		description: "Age",
		example: 35,
		minimum: 0,
		maximum: 150,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(150)
	age: number;

	@ApiProperty({
		description: "Unique Fingerprint of user",
		example: "a1b2c3d4e5f6",
		maxLength: 255,
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	fingerprint: string;

	@ApiProperty({
		description: "About user",
		example: "About me",
		maxLength: 1000,
		required: false,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(1000)
	about?: string;

	@ApiProperty({
		description: "Ip address of user",
		example: "192.168.1.1",
		required: false,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsIP()
	ipAddress?: string;

	@ApiProperty({
		description: "User-agent",
		example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
		required: false,
		maxLength: 255,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	userAgent?: string;
}
