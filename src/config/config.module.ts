import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { validate } from "./env.validation";

@Module({
	imports: [
		NestConfigModule.forRoot({
			isGlobal: true,
			validate,
			ignoreEnvFile: process.env.NODE_ENV === "production",
			envFilePath: `./env/.env.${process.env.NODE_ENV === "test" ? "test" : "dev"}`,
		}),
	],
})
export class ConfigModule {}
