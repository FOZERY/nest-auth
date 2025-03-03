import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsIP,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
	ValidateIf,
} from "class-validator";
import { NoSpaces } from "../../../../common/class-validator/noSpaces.decorator";

export class LoginUserRequestDTO {
	@ApiProperty({
		description: "User login",
		required: false,
		example: "johndoe",
		type: String,
		minLength: 3,
		maxLength: 255,
	})
	@ValidateIf((o) => !o.email)
	@IsNotEmpty()
	@IsString()
	@NoSpaces()
	@Matches(/^[a-zA-Z0-9_-]*$/, {
		message: "The string should not contain special characters",
	})
	@MinLength(3)
	@MaxLength(255)
	login?: string;

	@ApiProperty({
		description: "User email",
		required: false,
		example: "john.doe@example.com",
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
		example: "Pass1234!",
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
		example: "192.168.1.100",
		type: String,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsIP()
	ipAddress?: string;

	@ApiProperty({
		description: "Browser fingerprint",
		required: true,
		example: "6fd4s86f1ds68f41ds8f4ds",
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
