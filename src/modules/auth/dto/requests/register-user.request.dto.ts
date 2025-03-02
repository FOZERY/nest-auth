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
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	login: string;

	@IsNotEmpty()
	@IsEmail()
	@MaxLength(255)
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(150)
	age: number;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(1000)
	about?: string;

	@IsOptional()
	@IsNotEmpty()
	@IsIP()
	ipAddress?: string;

	@IsNotEmpty()
	@IsString()
	fingerprint: string;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	userAgent: string;
}
