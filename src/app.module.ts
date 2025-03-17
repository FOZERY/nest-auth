import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import cookieParser from "cookie-parser";
import { APP_PIPE } from "@nestjs/core";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: process.env.NODE_ENV === "production",
			envFilePath: `./env/.env.${process.env.NODE_ENV === "test" ? "test" : "dev"}`,
		}),
		UsersModule,
		AuthModule,
	],
	providers: [
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				whitelist: true,
				transform: true,
				transformOptions: {
					exposeDefaultValues: true,
					exposeUnsetFields: true,
				},
			}),
		},
	],
	controllers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(cookieParser()).forRoutes("*");
	}
}
