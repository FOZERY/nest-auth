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
		example: "johndoe",
		maxLength: 255,
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	login: string;

	@ApiProperty({
		description: "Email",
		example: "john.doe@example.com",
		maxLength: 255,
	})
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(255)
	email: string;

	@ApiProperty({
		description: "Password",
		example: "Pass1234!",
		maxLength: 255,
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	password: string;

	@ApiProperty({
		description: "Age",
		example: 30,
		minimum: 0,
		maximum: 150,
		type: "integer",
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(150)
	age: number;

	@ApiProperty({
		description: "Unique Fingerprint of user",
		example: "6fd4s86f1ds68f41ds8f4ds",
		maxLength: 255,
		type: "string",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	fingerprint: string;

	@ApiProperty({
		description: "About user",
		example: "Software developer with 5 years of experience",
		maxLength: 1000,
		required: false,
		type: "string",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(1000)
	about?: string;

	@ApiProperty({
		description: "Ip address of user",
		example: "192.168.1.100",
		required: false,
		type: "string",
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
		type: "string",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	userAgent?: string;
}
