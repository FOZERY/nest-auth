import { plainToInstance } from "class-transformer";
import {
	IsBoolean,
	IsEnum,
	IsIP,
	IsNumber,
	IsString,
	Matches,
	validateSync,
} from "class-validator";

enum Environment {
	Development = "development",
	Production = "production",
	Test = "test",
}

enum LogLevel {
	Trace = "trace",
	Debug = "debug",
	Info = "info",
	Warn = "warn",
	Error = "error",
	Fatal = "fatal",
}

export class EnvironmentVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment;

	@IsString()
	APP_NAME: string;

	@IsNumber()
	APP_PORT: number = 3000;

	@IsString()
	POSTGRES_USER: string;

	@IsString()
	POSTGRES_PASSWORD: string;

	@IsString()
	POSTGRES_DB: string;

	@IsNumber()
	POSTGRES_PORT: number;

	@IsString()
	JWT_ACCESS_SECRET: string;

	@IsString()
	JWT_REFRESH_SECRET: string;

	@Matches(/^\d+[smhd]$/)
	REFRESH_EXPIRED_IN: string;

	@Matches(/^\d+[smhd]$/)
	ACCESS_EXPIRED_IN: string;

	@IsString()
	DATABASE_URL: string;

	@IsString()
	REDIS_USER: string;

	@IsString()
	REDIS_PASSWORD: string;

	@IsString()
	S3_URL: string;

	@IsIP()
	REDIS_HOST: string;

	@IsNumber()
	REDIS_PORT: number;

	@IsString()
	S3_ACCESS_KEY_ID: string;

	@IsString()
	S3_SECRET_ACCESS_KEY: string;

	@IsString()
	S3_REGION: string;

	@IsEnum(LogLevel)
	LOG_LEVEL: string;

	@IsBoolean()
	LOG_TO_CONSOLE: boolean;
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
		exposeDefaultValues: true,
	});
	const errors = validateSync(validatedConfig, { skipMissingProperties: false });

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}
	return validatedConfig;
}
