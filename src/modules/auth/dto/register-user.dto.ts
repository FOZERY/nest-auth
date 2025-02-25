import {
	IsEmail,
	IsIP,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	Max,
	MaxLength,
	Min,
} from "class-validator";

export class RegisterUserDTO {
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	login: string;

	@IsEmail()
	@IsNotEmpty()
	@MaxLength(255)
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(150)
	age: number;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MaxLength(1000)
	about?: string;

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
