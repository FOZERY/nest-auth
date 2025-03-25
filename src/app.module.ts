import { createKeyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { ClsModule } from "nestjs-cls";
import { LoggerModule } from "nestjs-pino";
import { ConfigModule } from "./config/config.module";
import { pinoConfig } from "./external/logger/pino/pino.config";
import { clsConfig } from "./external/persistence/cls-transactional/cls.config";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
	imports: [
		ConfigModule,
		LoggerModule.forRootAsync(pinoConfig),
		ClsModule.forRoot(clsConfig),
		// TODO: вынести в отдельный конфиг
		CacheModule.registerAsync({
			useFactory: (configService: ConfigService) => {
				return {
					stores: [
						createKeyv(
							`redis://:${configService.get("REDIS_PASSWORD")}@${configService.get("REDIS_HOST")}:${configService.get("REDIS_PORT")}`
						),
					],
				};
			},
			inject: [ConfigService],
			isGlobal: true,
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
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(cookieParser()).forRoutes("*");
	}
}
