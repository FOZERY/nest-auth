import { BullModule } from "@nestjs/bullmq";
import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { ClsModule } from "nestjs-cls";
import { LoggerModule } from "nestjs-pino";
import { AppConfigModule } from "./config/config.module";
import { RedisModule } from "./external/cache/redis/redis.module";
import { pinoConfig } from "./external/logger/pino/pino.config";
import { clsConfig } from "./external/persistence/cls-transactional/cls.config";
import { S3Module } from "./external/s3/s3.module";
import { AuthModule } from "./modules/auth/auth.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { UserBalanceResetModule } from "./modules/users-balance-reset/user-balance-reset.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
	imports: [
		AppConfigModule,
		LoggerModule.forRootAsync(pinoConfig),
		ClsModule.forRoot(clsConfig),
		RedisModule,
		BullModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				connection: {
					host: configService.get<string>("REDIS_HOST"),
					port: configService.get<number>("REDIS_PORT"),
					password: configService.get<string>("REDIS_PASSWORD"),
				},
			}),
			inject: [ConfigService],
		}),
		S3Module.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				region: configService.get<string>("S3_REGION") || "",
				endpoint: configService.get<string>("S3_URL") || "",
				credentials: {
					accessKeyId: configService.get<string>("S3_ACCESS_KEY_ID") || "",
					secretAccessKey: configService.get<string>("S3_SECRET_ACCESS_KEY") || "",
				},
			}),
			inject: [ConfigService],
		}),
		UsersModule,
		TransactionsModule,
		AuthModule,
		UserBalanceResetModule,
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
