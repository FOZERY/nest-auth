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
		example: "login",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	login?: string;

	@ApiPropertyOptional({
		description: "Email",
		example: "Email",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(255)
	email?: string;

	@ApiPropertyOptional({
		description: "Age",
		example: 20,
	})
	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(150)
	age?: number;

	@ApiPropertyOptional({
		description: "About",
		example: "About",
	})
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(1000)
	about?: string;
}
