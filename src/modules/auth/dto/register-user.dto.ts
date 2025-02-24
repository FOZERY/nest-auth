import { IsEmail, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class RegisterUserDTO {
	@IsString()
	@MaxLength(255)
	login: string;

	@IsEmail()
	@MaxLength(255)
	email: string;

	@IsString()
	password: string;

	@IsNumber()
	@Min(0)
	@Max(150)
	age: number;

	@IsOptional()
	@IsString()
	@MaxLength(1000)
	about?: string;
}
