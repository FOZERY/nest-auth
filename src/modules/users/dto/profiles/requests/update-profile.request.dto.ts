import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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

export class UpdatePersonalProfileRequestDTO {
	@ApiPropertyOptional({
		description: "Login",
		example: "johndoe",
		maxLength: 255,
		type: "string",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	login?: string;

	@ApiPropertyOptional({
		description: "Email",
		example: "john.doe@example.com",
		type: "string",
		maxLength: 255,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(255)
	email?: string;

	@ApiPropertyOptional({
		description: "Age",
		example: 30,
		minimum: 0,
		maximum: 150,
		type: "integer",
	})
	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(150)
	age?: number;

	@ApiPropertyOptional({
		description: "About",
		example: "Software developer with 5 years of experience",
		maxLength: 1000,
		type: "string",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(1000)
	about?: string;
}
