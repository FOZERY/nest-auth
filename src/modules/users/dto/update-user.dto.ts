import {
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	Max,
	MaxLength,
	Min,
} from "class-validator";

export class UpdateUserDto {
	@IsUUID()
	id: string;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	login?: string;

	@IsOptional()
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(255)
	email?: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(150)
	age?: number;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(1000)
	about?: string;
}
