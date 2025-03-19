import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { ClsModule } from "nestjs-cls";
import { LoggerModule } from "nestjs-pino";
import { clsConfig } from "./config/cls.config";
import { ConfigModule } from "./config/config.module";
import { loggerConfig } from "./config/logger.config";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
	imports: [
		ConfigModule,
		LoggerModule.forRootAsync(loggerConfig),
		ClsModule.forRoot(clsConfig),
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
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(cookieParser()).forRoutes("*");
	}
}
