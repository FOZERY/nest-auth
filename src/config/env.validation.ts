import { IsEnum, IsString, validateSync } from "class-validator";

enum Environment {
	Development = "development",
	Production = "production",
	Test = "test",
}

export class EnvironmentVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment;

	@IsString()
	LOG_LEVEL: string;

	@IsString()
	LOG_TO_CONSOLE: string;

	// Добавьте сюда другие переменные окружения, которые используются в приложении
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = Object.assign(new EnvironmentVariables(), config);
	const errors = validateSync(validatedConfig, { skipMissingProperties: false });

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}
	return validatedConfig;
}
