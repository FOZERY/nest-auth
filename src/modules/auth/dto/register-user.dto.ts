import {
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
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
}
